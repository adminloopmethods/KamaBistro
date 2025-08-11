import {Router} from "express";
import WebsiteController from "./website.controllers.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
// import {ContentSchema} from "../../validation/contentSchema.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import {checkPermission} from "../../helper/roleBasedAccess.js";
import auditLogger from "../../helper/auditLogger.js";

const router = Router();

router.get(
  "/getContentForWebsite/:slug",
  //   checkPermission(requiredPermissionsForContentManagement),
  tryCatchWrap(WebsiteController.GetContentForWebsite)
);

export default router;
