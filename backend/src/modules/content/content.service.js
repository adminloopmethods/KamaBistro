import {logger} from "../../config/index.js";
import {assert, assertEvery} from "../../errors/assertError.js";
import {
  fetchResources,
  assignUserToResource,
  fetchEligibleUsers,
  fetchResourceInfo,
  fetchAssignedUsers,
  fetchContent,
  fetchAllResourcesWithContent,
  createOrUpdateVersion,
  publishContent,
  updateContentAndGenerateRequest,
  fetchRequests,
  fetchRequestInfo,
  markAllAssignedUserInactive,
  approveRequestInVerification,
  approveRequestInPublication,
  rejectRequestInVerification,
  rejectRequestInPublication,
  fetchVersionsList,
  deleteAllResourceRelatedDataFromDb,
  fetchVersionsInfo,
  restoreLiveVersion,
  deactivateResource,
  activateResource,
  getTotalRolesCounts,
  getTotalUserCounts,
  getTotalResourceRole,
  getTotalAvailableRequests,
  getTotalAvailableProjects,
  scheduleRequestToPublish,
  createResources,
  fetchVersionContent,
  checkSlugExists,
  fetchAllFilters,
  fetchAllResourceSlugs
} from "../../repository/content.repository.js";

// Create New Resource ================================


const addNewResource = async (
  titleEn,
  titleAr,
  slug,
  resourceType,
  resourceTag,
  relationType,
  parentId,
  filters,
  icon,
  image,
  referenceDoc,
  comments,
  sections
) => {

  // Check if slug exists
  const existingResource = await checkSlugExists(slug);
  if (existingResource) {
    throw new Error("Resource with this slug already exists");
  }


  // Create the resource with all its related data
  const newResource = await createResources(
    titleEn,
    titleAr,
    slug,
    resourceType,
    resourceTag,
    relationType,
    parentId,
    filters,
    icon,
    image,
    referenceDoc,
    comments,
    sections
  );

  logger.info({
    response: "New resource created successfully",
  });
  return {message: "Success", newResource};
};

//=====================================================

const getResources = async (
  resourceType,
  resourceTag,
  relationType,
  isAssigned,
  search,
  status,
  pageNum,
  limitNum,
  fetchType,
  userId,
  roleId,
  apiCallType,
  filterText,
  parentId
) => {
  if (fetchType === "CONTENT") {
    const resources = await fetchAllResourcesWithContent(
      resourceType,
      resourceTag,
      relationType,
      isAssigned,
      search,
      status,
      pageNum,
      limitNum,
      userId,
      roleId,
      apiCallType,
      filterText,
      parentId
    );
    logger.info({
      response: "Resources fetched successfully with content",
      // resources: resources,
    });
    return {message: "Success", resources};
  } else if(fetchType === 'SLUG'){
    const resources =  await fetchAllResourceSlugs( resourceType,
      resourceTag,)
      logger.info({
        response: "Resource's slug fetch successfully",
      });
      return {message: "Success", resources};
  }
  const resources = await fetchResources(
    resourceType,
    resourceTag,
    relationType,
    isAssigned,
    search,
    status,
    pageNum,
    limitNum,
    userId,
    roleId,
    apiCallType,
    filterText,
    parentId
  );
  logger.info({
    response: "Resources fetched successfully without content",
    // resources: resources,
  });
  return {message: "Success", resources};
};

const getResourceInfo = async (resourceId) => {
  const resourceInfo = await fetchResourceInfo(resourceId);
  logger.info({
    response: "Page Info fetched successfully",
    // resourceInfo: resourceInfo,
  });
  return {message: "Success", resourceInfo};
};

const getAssignedUsers = async (resourceId) => {
  const assignedUsers = await fetchAssignedUsers(resourceId);
  logger.info({
    response: `assignedUsers fetched successfully`,
    // assignedUsers: assignedUsers,
  });
  return {message: "Success", assignedUsers};
};

const getEligibleUser = async (roleType, permission) => {
  const eligibleUsers = await fetchEligibleUsers(roleType, permission);
  logger.info({
    response: `eligibleUsers fetched successfully for ${roleType} and ${permission}`,
    // eligibleUsers: eligibleUsers,
  });
  return {message: "Success", eligibleUsers};
};

const assignUser = async (
  resourceId,
  manager,
  editor,
  verifiers,
  publisher
) => {
  const assignedUsers = await assignUserToResource(
    resourceId,
    manager,
    editor,
    verifiers,
    publisher
  );
  logger.info({
    response: `Users assigned successfully`,
    // assignedUsers: assignedUsers,
  });
  return {message: "Users assigned successfully", assignedUsers};
};

const removeAssignedUser = async (resourceId) => {
  assert(resourceId, "NOT_FOUND", "ResourceId required");
  const result = await markAllAssignedUserInactive(resourceId);
  logger.info({
    response: `Users removed successfully`,
    // result: result,
  });
  return {message: "Users removed successfully", result};
};

const getContent = async (resourceId) => {
  const content = await fetchContent(resourceId);
  logger.info({
    response: "Content fetched successfully",
    // content: content,
  });
  return {message: "Success", content};
};

const updateContent = async (saveAs, content) => {
  // If saveAs is provided, update the version status in the content
  if (saveAs && content.newVersionEditMode) {
    content.newVersionEditMode.versionStatus = saveAs;
  }
  const updatedContent = await createOrUpdateVersion(content);
  logger.info({
    response: "Content updated successfully",
    updatedContent: updatedContent,
  });
  return {message: updatedContent.message, resource: updatedContent.resource};
};

const directPublishContent = async (content, userId) => {
  const publishedContent = await publishContent(content, userId);
  logger.info({
    response: "Content published successfully",
    publishedContent: publishedContent,
  });
  return {message: "Success", content: publishedContent};
};

const generateRequest = async (content, userId) => {
  const request = await updateContentAndGenerateRequest(content, userId);
  logger.info({
    response: "Content update request has been generated",
    request: request,
  });
  return {message: "Success", content: request};
};

const getRequest = async (
  userId,
  roleId,
  permission,
  search,
  status,
  pageNum,
  limitNum,
  resourceId
) => {
  const requests = await fetchRequests(
    userId,
    roleId,
    permission,
    search,
    status,
    pageNum,
    limitNum,
    resourceId
  );
  logger.info({
    response: "Requests fetched successfully",
    // requests: requests,
  });
  return {message: "Success", requests};
};

const getRequestInfo = async (requestId) => {
  const requestInfo = await fetchRequestInfo(requestId);
  logger.info({
    response: "Request Info fetched successfully",
    // requestInfo: requestInfo,
  });
  return {message: "Success", requestInfo};
};

const approveRequest = async (requestId, userId) => {
  // First, get the request to determine if it's a verification or publication request
  const requestInfo = await fetchRequestInfo(requestId);

  let request;
  // Check the request type to determine which approval function to use
  if (requestInfo.details.requestType === "PUBLICATION") {
    // This is a publication request, use approveRequestInPublication
    request = await approveRequestInPublication(requestId, userId);
  } else {
    // This is a verification request, use approveRequestInVerification
    request = await approveRequestInVerification(requestId, userId);
  }

  logger.info({
    response: "Request Approved successfully",
    // request: request,
  });
  return {message: "Success", request};
};

const rejectRequest = async (requestId, userId, rejectReason) => {
  // First, get the request to determine if it's a verification or publication request
  const requestInfo = await fetchRequestInfo(requestId);

  let request;
  // Check the request type to determine which rejection function to use
  if (requestInfo.details.requestType === "PUBLICATION") {
    // This is a publication request, use rejectRequestInPublication
    request = await rejectRequestInPublication(requestId, userId, rejectReason);
  } else {
    // This is a verification request, use rejectRequestInVerification
    request = await rejectRequestInVerification(
      requestId,
      userId,
      rejectReason
    );
  }

  logger.info({
    response: "Request Rejected successfully",
    request: request,
  });
  return {message: "Success", request};
};

const scheduleRequest = async (requestId, userId, date) => {
  const request = await scheduleRequestToPublish(requestId, userId, date);
  logger.info({
    response: "Request Scheduled successfully",
    // request: request,
  });
  return {message: "Success", request};
};

const PublishRequest = async (requestId) => {
  const request = await fetchRequestInfo(requestId);
  logger.info({
    response: "Request Published successfully",
    // request: request,
  });
  return {message: "Success", request};
};

const getVersionsList = async (resourceId, search, status, page, limit) => {
  const content = await fetchVersionsList(
    resourceId,
    search,
    status,
    page,
    limit
  );
  logger.info({
    response: "Version history fetched successfully",
    // content: content,
  });
  return {message: "Success", content};
};

const getVersionInfo = async (versionId) => {
  const content = await fetchVersionsInfo(versionId);
  logger.info({
    response: "Version info fetched successfully",
    // content: content,
  });
  return {message: "Success", content};
};

const restoreVersion = async (versionId) => {
  const content = await restoreLiveVersion(versionId);
  logger.info({
    response: "Version restored successfully",
    // content: content,
  });
  return {message: "Success", content};
};

const deleteAllContentData = async () => {
  const result = await deleteAllResourceRelatedDataFromDb();
  logger.info({
    response: "All content-related data deleted successfully",
    result: result,
  });
  return {message: "All content-related data deleted successfully", result};
};

const deactivateResources = async (resourceId) => {
  assert(resourceId, "NOT_FOUND", "ResourceId required");
  const result = await deactivateResource(resourceId);
  logger.info({
    response: `Resource deactivated successfully`,
    // result: result,
  });
  return {message: "Resource deactivated successfully", result};
};

const activateResources = async (resourceId) => {
  assert(resourceId, "NOT_FOUND", "ResourceId required");
  const result = await activateResource(resourceId);
  logger.info({
    response: `Resource activated successfully`,
    // result: result,
  });
  return {message: "Resource activated successfully", result};
};

const getDashboardInsight = async () => {
  const totalRoles = await getTotalRolesCounts();
  const totalUsers = await getTotalUserCounts();
  const totalResourceRoles = await getTotalResourceRole();
  const totalAvailableRequests = await getTotalAvailableRequests();
  const totalAvailableProjects = await getTotalAvailableProjects();

  const result = {
    totalRoles,
    totalUsers,
    totalResourceRoles,
    totalAvailableRequests,
    totalAvailableProjects,
  };

  logger.info({
    response: "All content-related dashboard insight fetched successfully",
    result: result,
  });

  return {
    message: "All content-related dashboard insight fetched successfully",
    result,
  };
};

const getVersionContent = async (versionId) => {
  const response = await fetchVersionContent(versionId);
  if (!response) {
    throw new Error("Version not found");
  }
  return {
    message: "Version content fetched successfully",
    data: response,
  };
};

const getAllFilters = async (resourceId) => {
  const filters = await fetchAllFilters(resourceId);
  return { message: "Success", filters };
};

export {
  getResources,
  getResourceInfo,
  getEligibleUser,
  assignUser,
  removeAssignedUser,
  getAssignedUsers,
  getContent,
  updateContent,
  directPublishContent,
  generateRequest,
  getRequest,
  getRequestInfo,
  approveRequest,
  rejectRequest,
  scheduleRequest,
  PublishRequest,
  getVersionsList,
  getVersionInfo,
  restoreVersion,
  deleteAllContentData,
  deactivateResources,
  activateResources,
  getDashboardInsight,
  getVersionContent,
  addNewResource,
  getAllFilters
};
