import {Router} from "express";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import auditLogger from "../../helper/auditLogger.js";
import {
  createWebpage,
  getAllContentsController,
  getAllWebpages,
  getContentByIdController,
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

// router.use(authenticateUser);

// Static routes first
router.get("/section", authenticateUser, getAllContentsController);
router.get(
  "/proposed-versions",
  authenticateUser,
  tryCatchWrap(getProposedVersions)
);

// Parameterized routes in order of specificity
router.get("/section/:id", authenticateUser, getContentByIdController);
router.get("/route/:route", getWebpageByRoute);
router.get("/:id", authenticateUser, tryCatchWrap(getWebpageById));

// CRUD operations
router.get("/", authenticateUser, tryCatchWrap(getAllWebpages));
router.post("/", authenticateUser, tryCatchWrap(createWebpage));
router.put("/:id", authenticateUser, tryCatchWrap(updateWebpageById));
router.post(
  "/propose/:id",
  authenticateUser,
  tryCatchWrap(proposeWebpageUpdate)
);

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
