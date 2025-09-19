import {Router} from "express";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import auditLogger from "../../helper/auditLogger.js";
import {
  approveProposedVersion,
  createWebpage,
  getAllContentsController,
  getAllWebpages,
  getContentByIdController,
  getProposedVersionbyID,
  getProposedVersions,
  getWebpageById,
  getWebpageByRoute,
  proposeWebpageUpdate,
  // proposeWebpageVersion,
  updateWebpageById,
  // clearWebpagesTablesController
} from "./content.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
// import ContentController from "./content.controller.js";
// import validator from "../../validation/validator.js";
// import {ContentSchema} from "../../validation/contentSchema.js";
// import contentController from "./content.controller.js";

const router = Router();

/// Public route (no authentication)
router.get("/route/:route", getWebpageByRoute);

// Authenticated routes
router.use(authenticateUser);

// Collection routes
router.get("/", tryCatchWrap(getAllWebpages));
router.post("/", tryCatchWrap(createWebpage));

// Section routes
router.get("/section", getAllContentsController);
router.get("/section/:id", getContentByIdController);

// Proposed versions routes
router.get("/proposed-versions", tryCatchWrap(getProposedVersions));
router.get("/proposed-versions/:id", tryCatchWrap(getProposedVersionbyID));
router.post(
  "/proposed-versions/approve/:id",
  tryCatchWrap(approveProposedVersion)
);

// Individual webpage routes
router.get("/:id", tryCatchWrap(getWebpageById));
router.put("/:id", tryCatchWrap(updateWebpageById));
router.post("/propose/:id", tryCatchWrap(proposeWebpageUpdate));
// router.delete("/", clearWebpagesTablesController)

// router.post(
//   "/addResource",
//   auditLogger,
//   tryCatchWrap(ContentController.AddNewResource)
// );

// router.get(
//   "/getResources",
//   tryCatchWrap(ContentController.GetResources)
// );

// router.get(
//   "/getResourceInfo/:resourceId",
//   tryCatchWrap(ContentController.GetResourceInfo)
// );

// router.get(
//   "/getAssignedUsers/:resourceId",
//   tryCatchWrap(ContentController.GetAssignedUsers)
// );

// router.get(
//   "/getEligibleUsers",
//   tryCatchWrap(ContentController.GetEligibleUser)
// );

// router.post(
//   "/assignUser",
//   auditLogger,
//   tryCatchWrap(ContentController.AssignUser)
// );

// router.patch(
//   "/removeAssignedUser/:resourceId",
//   auditLogger,
//   tryCatchWrap(ContentController.RemoveAssignedUser)
// );

// router.get(
//   "/getContent/:resourceId",
//   tryCatchWrap(ContentController.GetContent)
// );

// router.put(
//   "/updateContent",
//   auditLogger,
//   tryCatchWrap(ContentController.UpdateContent)
// );

// router.post(
//   "/directPublishContent",
//   auditLogger,
//   tryCatchWrap(ContentController.DirectPublishContent)
// );

// router.put(
//   "/generateRequest",
//   auditLogger,
//   tryCatchWrap(ContentController.GenerateRequest)
// );

// router.get(
//   "/getRequests",
//   tryCatchWrap(ContentController.GetRequest)
// );

// router.get(
//   "/getRequestInfo/:requestId",
//   tryCatchWrap(ContentController.GetRequestInfo)
// );

// router.post(
//   "/approveRequest/:requestId",
//   auditLogger,
//   tryCatchWrap(ContentController.ApproveRequest)
// );

// router.post(
//   "/rejectRequest/:requestId",
//   auditLogger,
//   tryCatchWrap(ContentController.RejectRequest)
// );

// router.post(
//   "/scheduleRequest/:requestId",
//   auditLogger,
//   tryCatchWrap(ContentController.ScheduleRequest)
// );

// // router.post(
// //   "/publishRequest/:requestId",
// //   //   checkPermission(requiredPermissionsForContentManagement),
// //   tryCatchWrap(ContentController.PublishRequest)
// // );

// router.get(
//   "/getVersionsList/:resourceId",
//   tryCatchWrap(ContentController.GetVersionsList)
// );

// router.get(
//   "/getVersionInfo/:versionId",
//   tryCatchWrap(ContentController.GetVersionInfo)
// );

// router.get(
//   "/restoreVersion/:versionId",
//   tryCatchWrap(ContentController.RestoreVersion)
// );

// router.delete(
//   "/deleteAllContentData",
//   tryCatchWrap(ContentController.DeleteAllContentData)
// );

// router.put(
//   "/deactivateResource/:resourceId",
//   tryCatchWrap(ContentController.DeactivateResources)
// );

// router.put(
//   "/activateResource/:resourceId",
//   tryCatchWrap(ContentController.ActivateResources)
// );

// router.get(
//   "/getDashboardInsight",
//   tryCatchWrap(contentController.GetDashboardInsight)
// );

// router.get(
//   "/getVersionContent/:versionId",
//   tryCatchWrap(ContentController.GetVersionContent)
// );

// router.get(
//   "/getAllFilters",
//   tryCatchWrap(ContentController.GetAllFilters)
// );

export default router;
