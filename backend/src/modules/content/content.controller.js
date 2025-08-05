// import {eventEmitter} from "../../helper/event.js";
import {createNotification} from "../../repository/notification.repository.js";
import prisma from "../../config/dbConfig.js";
import {
  getResources,
  getResourceInfo,
  getEligibleUser,
  assignUser,
  getAssignedUsers,
  getContent,
  updateContent,
  directPublishContent,
  generateRequest,
  getRequest,
  getRequestInfo,
  removeAssignedUser,
  approveRequest,
  rejectRequest,
  getVersionsList,
  deleteAllContentData,
  getVersionInfo,
  restoreVersion,
  deactivateResources,
  activateResources,
  getDashboardInsight,
  scheduleRequest,
  getVersionContent,
  addNewResource,
  getAllFilters,
} from "./content.service.js";
import { handleEntityCreationNotification } from "../../helper/notificationHelper.js";



const AddNewResource = async (req, res) => {
  const {
    titleEn,
    titleAr,
    slug,
    resourceType,
    resourceTag,
    relationType,
    parentId = null,
    filters = [],
    icon = null,
    image = null,
    referenceDoc = null,
    comments,
    sections = []
  } = req.body;

  const newResourceResult = await addNewResource(
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
    sections,
  );
  // Fetch the full resource with all fields for notification
  const createdResource = await prisma.resource.findUnique({
    where: { slug },
  });
  // Send notification
  const io = req.app.locals.io;
  await handleEntityCreationNotification({
    io,
    userId: req.user?.id,
    entity: "resource",
    newValue: createdResource,
    actionType: "CREATE",
    resource: createdResource,
  });
  res.status(200).json(newResourceResult);
};

const GetResources = async (req, res) => {
  const {
    resourceType,
    resourceTag,
    relationType,
    isAssigned,
    search,
    status,
    page,
    limit,
    fetchType,
    roleId,
    apiCallType,
    filterText,
    parentId,
  } = req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 100;
  const userId = req.user.id;

  const response = await getResources(
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
  );
  res.status(200).json(response);
};

const GetResourceInfo = async (req, res) => {
  const {resourceId} = req.params;
  const response = await getResourceInfo(resourceId);
  res.status(200).json(response);
};

const GetAssignedUsers = async (req, res) => {
  const {resourceId} = req.params;
  const response = await getAssignedUsers(resourceId);
  res.status(200).json(response);
};

const GetEligibleUser = async (req, res) => {
  const {roleType, permission} = req.query;
  const response = await getEligibleUser(roleType, permission);
  res.status(200).json(response);
};

const AssignUser = async (req, res) => {
  const {resourceId, manager, editor, verifiers, publisher} = req.body;
  const response = await assignUser(
    resourceId,
    manager,
    editor,
    verifiers,
    publisher
  );
  // Notification: resource assignment (call only once after all assignments)
  const io = req.app.locals.io;
  // Fetch the updated resource with all roles and verifiers
  const updatedResource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: {
      roles: { where: { status: "ACTIVE" }, include: { user: true } },
      verifiers: { where: { status: "ACTIVE" }, include: { user: true } },
    },
  });
  if (!updatedResource) {
    return res.status(404).json({ message: "Resource not found for assignment" });
  }
  await handleEntityCreationNotification({
    io,
    userId: req.user?.id,
    entity: "resource",
    newValue: updatedResource,
    actionType: "ASSIGN",
    resource: updatedResource,
    actionDetails: { assignmentRole: "ALL" },
  });
  res.status(200).json(response);
};

const RemoveAssignedUser = async (req, res) => {
  const {resourceId} = req.params;
  const response = await removeAssignedUser(resourceId);
  res.status(200).json(response);
};

const GetContent = async (req, res) => {
  const {resourceId} = req.params;
  const response = await getContent(resourceId);
  res.status(200).json(response);
};

const UpdateContent = async (req, res) => {
  const {saveAs} = req.query;
  const content = req.body;
  const response = await updateContent(saveAs, content);
  res.status(200).json(response);
};

// Direct Publish by super admin or managers
const DirectPublishContent = async (req, res) => {
  const content = req.body;
  const response = await directPublishContent(content, req.user.id);
  res.status(200).json(response);
};

const GenerateRequest = async (req, res) => {
  const content = req.body;
  const response = await generateRequest(content, req.user.id);
  res.status(200).json(response);
};

const GetRequest = async (req, res) => {
  const {roleId, permission, search, status, page, limit, resourceId} =
    req.query;
  const userId = req.user.id;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 100;
  const response = await getRequest(
    userId,
    roleId,
    permission,
    search,
    status,
    pageNum,
    limitNum,
    resourceId
  );
  res.status(200).json(response);
};

const GetRequestInfo = async (req, res) => {
  const {requestId} = req.params;
  const response = await getRequestInfo(requestId);
  res.status(200).json(response);
};

const ApproveRequest = async (req, res) => {
  const {requestId} = req.params;
  const userId = req.user.id;
  const response = await approveRequest(requestId, userId);
  // Notification: resource approve
  const io = req.app.locals.io;
  const resource = response.request?.resource || response.request?.resourceVersion?.resource;
  if (resource) {
    await handleEntityCreationNotification({
      io,
      userId,
      entity: "resource",
      newValue: resource,
      actionType: "APPROVE",
      resource,
      actionDetails: { requestType: "approve" },
    });
  }
  res.status(200).json(response);
};

const RejectRequest = async (req, res, next) => {
  const {requestId} = req.params;
  const userId = req.user.id;
  const {rejectReason} = req.body;
  const response = await rejectRequest(requestId, userId, rejectReason);
  // Notification: resource reject
  const io = req.app.locals.io;
  const resource = response.request?.resource || response.request?.resourceVersion?.resource;
  if (resource) {
    await handleEntityCreationNotification({
      io,
      userId,
      entity: "resource",
      newValue: resource,
      actionType: "REJECT",
      resource,
      actionDetails: { requestType: "reject" },
    });
  }
  res.status(200).json(response);
};

const ScheduleRequest = async (req, res) => {
  const {requestId} = req.params;
  const userId = req.user.id;
  const {date} = req.body;
  const response = await scheduleRequest(requestId, userId, date);
  // Notification: resource schedule
  const io = req.app.locals.io;
  const resource = response.request?.resource || response.request?.resourceVersion?.resource;
  if (resource) {
    await handleEntityCreationNotification({
      io,
      userId,
      entity: "resource",
      newValue: resource,
      actionType: "SCHEDULE",
      resource,
      actionDetails: { requestType: "schedule" },
    });
  }
  res.status(200).json(response);
};

const GetVersionsList = async (req, res) => {
  const {resourceId} = req.params;
  const {search, status, page, limit} = req.query;
  const response = await getVersionsList(
    resourceId,
    search,
    status,
    page,
    limit
  );
  res.status(200).json(response);
};

const GetVersionInfo = async (req, res) => {
  const {versionId} = req.params;
  const response = await getVersionInfo(versionId);
  res.status(200).json(response);
};

const RestoreVersion = async (req, res) => {
  const {versionId} = req.params;
  const response = await restoreVersion(versionId);
  res.status(200).json(response);
};

const DeleteAllContentData = async (_, res) => {
  const response = await deleteAllContentData();
  res.status(200).json(response);
};

const DeactivateResources = async (req, res) => {
  const {resourceId} = req.params;
  const response = await deactivateResources(resourceId);
  res.status(200).json(response);
};

const ActivateResources = async (req, res) => {
  const {resourceId} = req.params;
  const response = await activateResources(resourceId);
  res.status(200).json(response);
};

const GetDashboardInsight = async (_, res) => {
  const response = await getDashboardInsight();
  res.status(200).json(response);
};

const GetVersionContent = async (req, res) => {
  const {versionId} = req.params;
  const response = await getVersionContent(versionId);
  res.status(200).json(response);
};

const GetAllFilters = async (req, res) => {
  const { resourceId } = req.query;
  const response = await getAllFilters(resourceId);
  res.status(200).json(response);
};

export default {
  AddNewResource,
  GetResources,
  GetResourceInfo,
  GetEligibleUser,
  AssignUser,
  RemoveAssignedUser,
  GetAssignedUsers,
  GetContent,
  UpdateContent,
  DirectPublishContent,
  GenerateRequest,
  GetRequest,
  GetRequestInfo,
  ApproveRequest,
  RejectRequest,
  ScheduleRequest,
  GetVersionsList,
  GetVersionInfo,
  RestoreVersion,
  DeleteAllContentData,
  DeactivateResources,
  ActivateResources,
  GetDashboardInsight,
  GetVersionContent,
  GetAllFilters,
};
