import prismaClient from "../config/dbConfig.js";
import {
  fetchContent,
  fetchVersionContent,
} from "../repository/content.repository.js";
// import {createNotification} from "../repository/notification.repository.js";
import { handleEntityCreationNotification } from "./notificationHelper.js";
import transformContentForAudit from "./transformContentForAudit.js";

// --- Action Type/Performed Resolver ---
function resolveAction(req, method, entity) {
  const customActions = [
    {
      match: (req) =>
        req.baseUrl.includes("content") && req.path === "/updateContent",
      actionType: "DRAFT",
      action_performed: "Content saved (draft)",
    },
    {
      match: (req) =>
        (req.baseUrl.includes("content") || req.baseUrl.includes("resource")) &&
        req.path.includes("assignUser"),
      actionType: "ASSIGN",
      action_performed: "User assigned to resource",
    },
    {
      match: (req) =>
        (req.baseUrl.includes("content") || req.baseUrl.includes("resource")) &&
        req.path.includes("removeAssignedUser"),
      actionType: "REMOVE",
      action_performed: "Remove user",
    },
    {
      match: (req) =>
        req.baseUrl.includes("content") && req.path === "/directPublishContent",
      actionType: "DIRECT PUBLISH",
      action_performed: "Content directly published",
    },
    {
      match: (req) =>
        req.baseUrl.includes("content") && req.path === "/generateRequest",
      actionType: "REQUEST GENERATED",
      action_performed: "Content update is sent for verification",
    },
    {
      match: (req) =>
        req.baseUrl.includes("content") &&
        req.path.startsWith("/rejectRequest"),
      actionType: "REJECT",
      action_performed: "Request Rejected",
    },
    {
      match: (req) =>
        req.baseUrl.includes("content") &&
        req.path.startsWith("/approveRequest"),
      actionType: "APPROVE",
      action_performed: "Request approved",
    },
    {
      match: (req) =>
        req.baseUrl.includes("content") &&
        req.path.startsWith("/scheduleRequest"),
      actionType: "SCHEDULE",
      action_performed: "Version scheduled for publication",
    },
    {
      match: (req) =>
        req.baseUrl.includes("content") && req.path.startsWith("/addResource"),
      actionType: "CREATE RESOURCE",
      action_performed: "Added a new resource",
    },
    // Add more custom actions here as needed
  ];
  for (const ca of customActions) {
    if (ca.match(req))
      return {
        actionType: ca.actionType,
        action_performed: ca.action_performed,
      };
  }
  switch (method) {
    case "POST":
      return {
        actionType: "CREATE",
        action_performed:
          entity === "auth" ? `${entity} logged in` : `${entity} created`,
      };
    case "PUT":
    case "PATCH":
      return { actionType: "UPDATE", action_performed: `${entity} updated` };
    case "DELETE":
      return { actionType: "DELETE", action_performed: `${entity} deleted` };
    default:
      return { actionType: "ACCESS", action_performed: `${entity} accessed` };
  }
}

// --- Entity Audit Value Handlers ---
async function getResourceAssignments(resourceId) {
  const resource = await prismaClient.resource.findUnique({
    where: { id: resourceId },
    select: {
      titleEn: true,
      liveVersion: { select: { versionNumber: true } },
      newVersionEditMode: { select: { versionNumber: true } },
      roles: {
        select: {
          role: true,
          status: true,
          user: { select: { name: true } },
        },
      },
      verifiers: {
        select: {
          stage: true,
          status: true,
          user: { select: { name: true } },
        },
      },
    },
  });
  if (!resource) {
    return {
      resource: null,
      liveVersionNumber: null,
      editVersionNumber: null,
      roles: [
        { role: "MANAGER", users: [] },
        { role: "EDITOR", users: [] },
        { role: "PUBLISHER", users: [] },
        { role: "VERIFIER", users: [] },
      ],
    };
  }
  const roleMap = { MANAGER: [], EDITOR: [], PUBLISHER: [] };
  for (const r of resource.roles) {
    if (!roleMap[r.role]) roleMap[r.role] = [];
    roleMap[r.role].push({ name: r.user?.name, status: r.status });
  }
  const verifiers = resource.verifiers.map((v) => ({
    name: v.user?.name,
    stage: v.stage,
    status: v.status,
  }));
  return {
    resource: resource.titleEn,
    liveVersionNumber: resource.liveVersion?.versionNumber || null,
    editVersionNumber: resource.newVersionEditMode?.versionNumber || null,
    roles: [
      { role: "MANAGER", users: roleMap.MANAGER },
      { role: "EDITOR", users: roleMap.EDITOR },
      { role: "PUBLISHER", users: roleMap.PUBLISHER },
      { role: "VERIFIER", users: verifiers },
    ],
  };
}

const entityAuditHandlers = {
  role: async (id) => {
    const roleRecord = await prismaClient.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: {
              select: { name: true },
            },
          },
        },
      },
    });
    if (!roleRecord) return null;
    return {
      name: roleRecord.name,
      permissions: roleRecord.permissions.map((p) => p.permission.name),
      status: roleRecord.status,
    };
  },
  user: async (id) => {
    const userRecord = await prismaClient.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: {
                      select: { name: true },
                    },
                  },
                },
                roleType: true,
              },
            },
          },
        },
      },
    });
    if (!userRecord) return null;
    return {
      name: userRecord.name,
      status: userRecord.status,
      roles: userRecord.roles.map((r) => ({
        name: r.role.name,
        permissions: r.role.permissions.map((p) => p.permission.name),
      })),
    };
  },
  resource: getResourceAssignments,
  content: getResourceAssignments, // alias for content module
  // Add more entities as needed
};

// --- Helper to fetch approval log and construct audit value ---
async function getApprovalAuditValue({
  requestId,
  userId,
  actionType,
  req,
  statusFilter,
}) {
  if (!requestId || !userId) return null;
  const request = await prismaClient.resourceVersioningRequest.findUnique({
    where: { id: requestId },
    select: {
      approvals: true,
      resourceVersion: { include: { resource: true } },
      sender: true,
    },
  });
  if (!request || !Array.isArray(request.approvals)) return null;
  let approval;
  if (statusFilter) {
    approval = request.approvals.find(
      (a) => a.approverId === userId && a.status === statusFilter
    );
  } else {
    approval = request.approvals.find(
      (a) => a.approverId === userId && a.status !== actionType
    );
  }
  if (!approval)
    approval = request.approvals.find((a) => a.approverId === userId);
  if (!approval) return null;
  const role = approval.stage != null ? "VERIFIER" : "PUBLISHER";
  return {
    resource: request.resourceVersion.resource.titleEn,
    versionNumber: request.resourceVersion.versionNumber,
    actionBy: req.user?.name,
    comments: approval.comments || req.body?.rejectReason || null,
    stage: approval.stage ?? null,
    role,
    status: approval.status,
  };
}

const formatScheduleDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  // Format in Asia/Kolkata timezone (IST)
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    weekday: "long",
    timeZone: "Asia/Kolkata",
  };
  return date.toLocaleString("en-US", options);
};

// Middleware to log user actions in the database
const auditLogger = async (req, res, responseBodyOrNext) => {
  const { user, method } = req; // User info from authentication middleware
  const endPoint = req.baseUrl.split("/").pop(); // Extract entity name from route
  let entity = endPoint === "content" ? "resource" : endPoint;
  let entityId =
    req.params.id ||
    req.params.resourceId ||
    req.params.requestId ||
    req.body.id ||
    req.body.resourceId ||
    res?.user?.id ||
    responseBodyOrNext.id ||
    req.body.id || req.body.slug || req.body.parentId || null;
  const ipAddress = req.ip;
  const browserInfo = req.headers["user-agent"];

  let oldValue = null;
  let newValue = null;

  // Centralized actionType/action_performed
  let { actionType, action_performed } = resolveAction(req, method, entity);

  // Handler for fetching audit values
  const fetchAuditValue =
    entityAuditHandlers[entity] ||
    (async (id) => await prismaClient[entity]?.findUnique({ where: { id } }));

  // Special DRAFT (updateContent), DIRECT PUBLISH (directPublishContent), REQUEST GENERATED (generateRequest), REJECT, APPROVE, SCHEDULE cases
  if (
    (actionType === "DRAFT" && entity === "resource" && entityId) ||
    (actionType === "CREATE" && entity === "resource" && entityId) ||
    (actionType === "DIRECT PUBLISH" && entity === "resource" && entityId) ||
    (actionType === "REQUEST GENERATED" && entity === "resource" && entityId) ||
    ((actionType === "REJECT" ||
      actionType === "APPROVE" ||
      actionType === "SCHEDULE") &&
      entity === "resource" &&
      entityId)
  ) {
    // Fetch resource with liveVersion and newVersionEditMode
    const resource = await fetchContent(entityId);

    if (actionType === "DRAFT") {
      // Old value: edit version if exists, else live version
      let oldVersion =
        resource?.editModeVersionData || resource?.liveModeVersionData;
      if (oldVersion) {
        oldValue = await transformContentForAudit({
          ...resource,
          newVersionEditMode: oldVersion,
        });
      }
      // New value: transform incoming payload
      const { resourceId, ...bodyWithoutResourceId } = req.body;
      newValue = await transformContentForAudit(bodyWithoutResourceId);
    } else if (actionType === "DIRECT PUBLISH") {
      // Old value: live version only
      let oldVersion = resource?.liveModeVersionData;
      if (oldVersion) {
        oldValue = await transformContentForAudit({
          ...resource,
          newVersionEditMode: oldVersion,
        });
      }
      // New value: transform incoming payload
      const { resourceId, ...bodyWithoutResourceId } = req.body;
      newValue = await transformContentForAudit(bodyWithoutResourceId);
    } else if (actionType === "REQUEST GENERATED") {
      let oldVersion =
        resource?.editModeVersionData || resource?.liveModeVersionData;
      // Old value: content + request details if exist
      if (oldVersion) {
        oldValue = await transformContentForAudit({
          ...resource,
          newVersionEditMode: oldVersion,
        });
      }
      // New value: content from body + new request details (if generated)
      const { resourceId: rid, ...bodyWithoutResourceId } = req.body;
      newValue = await transformContentForAudit({
        ...bodyWithoutResourceId,
      });
    } else if (
      actionType === "REJECT" ||
      actionType === "APPROVE" ||
      actionType === "SCHEDULE"
    ) {
      // Use helper for oldValue
      const requestId = req.params.requestId || req.body.requestId || entityId;
      const userId = req.user?.id;
      const approvalAudit = await getApprovalAuditValue({
        requestId,
        userId,
        actionType,
        req,
      });
      let isPublisherPublication = false;
      let versionContentObj = null;
      if (
        (actionType === "APPROVE" || actionType === "SCHEDULE") &&
        approvalAudit &&
        approvalAudit.role === "PUBLISHER"
      ) {
        // Fetch the request to check type
        const request = await prismaClient.resourceVersioningRequest.findUnique(
          {
            where: { id: requestId },
            select: {
              type: true,
              resourceVersion: { select: { id: true, resourceId: true } },
            },
          }
        );
        if (request && request.type === "PUBLICATION") {
          isPublisherPublication = true;
          // Fetch the resource to get the liveVersionId BEFORE publishing/scheduling
          const resourceBefore = await prismaClient.resource.findUnique({
            where: { id: request.resourceVersion.resourceId },
            select: { liveVersionId: true },
          });
          let oldLiveContent = null;
          if (resourceBefore?.liveVersionId) {
            const oldLiveVersion = await fetchVersionContent(
              resourceBefore.liveVersionId
            );
            oldLiveContent = oldLiveVersion?.versionData || null;
          }
          const scheduledOrPublishedContent = await fetchVersionContent(
            request.resourceVersion.id
          );
          versionContentObj = {
            versionContent: {
              old: oldLiveContent,
              new: scheduledOrPublishedContent?.versionData || null,
            },
          };
        }
      }
      if (isPublisherPublication) {
        oldValue = { ...approvalAudit, ...(versionContentObj || {}) };
      } else {
        oldValue = approvalAudit;
      }
    } 
  } else if (
    ["UPDATE", "DELETE", "ASSIGN", "REMOVE"].includes(actionType) &&
    entityId
  ) {
    oldValue = await fetchAuditValue(entityId);
  }

  res.on("finish", async () => {
    // const io = req.app.locals.io; // ✅ Add this

    if (actionType === "CREATE" && !entityId) {
      entityId =
        res.locals.entityId ||
        res.locals.createdEntity?.id ||
        res._getData?.()?.id ||
        req.body?.id ||
        req.params.id ||
        req.params.resourceId ||
        req.body.id ||
        req.body.resourceId ||
        res?.user?.id ||
        null;
    }

    // Fetch the latest data from the DB after update
    if (res.statusCode >= 400) {
      newValue = req.body;
    } else if (
      (actionType === "DRAFT" && entity === "resource" && entityId) ||
      (actionType === "DIRECT PUBLISH" && entity === "resource" && entityId) ||
      (actionType === "REQUEST GENERATED" && entity === "resource" && entityId)
    ) {
      // Already set above
    }  
    else if (actionType === "CREATE RESOURCE") {
      newValue = req.body;
    }
    else if (
      (actionType === "REJECT" ||
        actionType === "APPROVE" ||
        actionType === "PUBLISH" ||
        actionType === "SCHEDULE") &&
      entity === "resource" &&
      entityId
    ) {
      // Use helper for newValue (after DB update)
      const requestId = req.params.requestId || req.body.requestId || entityId;
      const userId = req.user?.id;
      const approvalAudit = await getApprovalAuditValue({
        requestId,
        userId,
        actionType: actionType === "PUBLISH" ? "APPROVE" : actionType,
        req,
        statusFilter: actionType === "PUBLISH" ? "APPROVE" : actionType,
      });
      let isPublisherPublication = false;
      let versionContentObj = null;
      if (
        (actionType === "APPROVE" ||
          actionType === "PUBLISH" ||
          actionType === "SCHEDULE") &&
        approvalAudit &&
        approvalAudit.role === "PUBLISHER"
      ) {
        // Fetch the request to check type
        const request = await prismaClient.resourceVersioningRequest.findUnique(
          {
            where: { id: requestId },
            select: {
              type: true,
              resourceVersion: { select: { id: true, resourceId: true } },
            },
          }
        );
        if (request && request.type === "PUBLICATION") {
          isPublisherPublication = true;
          // Fetch the resource to get the liveVersionId BEFORE publishing/scheduling
          const resourceBefore = await prismaClient.resource.findUnique({
            where: { id: request.resourceVersion.resourceId },
            select: { liveVersionId: true },
          });
          let oldLiveContent = null;
          if (resourceBefore?.liveVersionId) {
            const oldLiveVersion = await fetchVersionContent(
              resourceBefore.liveVersionId
            );
            oldLiveContent = oldLiveVersion?.versionData || null;
          }
          const scheduledOrPublishedContent = await fetchVersionContent(
            request.resourceVersion.id
          );
          versionContentObj = {
            versionContent: {
              old: oldLiveContent,
              new: scheduledOrPublishedContent?.versionData || null,
            },
          };
        }
      }
      if (isPublisherPublication) {
        newValue = { ...approvalAudit, ...(versionContentObj || {}) };
        // For SCHEDULE, add the formatted scheduled date
        if (actionType === "SCHEDULE" && req.body?.date) {
          newValue.scheduledDate = formatScheduleDate(req.body.date);
        }
      } else {
        newValue = approvalAudit;
        if (actionType === "SCHEDULE" && req.body?.date) {
          newValue.scheduledDate = formatScheduleDate(req.body.date);
        }
      }
    } else if (
      ["CREATE", "UPDATE", "ASSIGN", "REMOVE"].includes(actionType) &&
      entityId
    ) {
      newValue = await fetchAuditValue(entityId);
    }
    try {
      await prismaClient.auditLog.create({
        data: {
          actionType,
          action_performed,
          entity,
          entityId,
          oldValue: oldValue ? oldValue : null,
          newValue: newValue ? newValue : null,
          ipAddress,
          browserInfo,
          outcome:
            res.statusCode >= 200 && res.statusCode < 300
              ? "Success"
              : "Failure",
          timestamp: new Date(),
          user: {
            create:
              entity === "auth" ? { userId: entityId } : { userId: user?.id },
          },
        },
      });

      // if (
      //   (actionType === "CREATE" && newValue) ||
      //   (actionType === "UPDATE" && newValue)
      // ) {
      //   await handleEntityCreationNotification({
      //     io,
      //     userId: user?.id,
      //     entity,
      //     newValue,
      //     actionType,
      //   });
      // }
    } catch (err) {
      console.error("Audit logging failed:", err);
    }
  });

  if (typeof responseBodyOrNext === "function") {
    responseBodyOrNext();
  }
};

export default auditLogger;
