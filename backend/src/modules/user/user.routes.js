import {Router} from "express";
import UserController from "./user.controller.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import validate from "../../validation/validator.js";
import {updateUserSchema, userSchema} from "../../validation/userSchema.js";
import {checkPermission} from "../../helper/roleBasedAccess.js";
import auditLogger from "../../helper/auditLogger.js";
import multer from "multer";
import mediaUploader from "../../helper/mediaUploader.js";
import {requireSuperAdmin} from "../../helper/requireSuperAdmin.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
const upload = multer({dest: "uploads/"});

const router = Router();

router.get("/locations", tryCatchWrap(UserController.GetAllLocations));
router.get("/getRolesForUser", tryCatchWrap(UserController.GetRolesForUser));
router.get("/getAllUsers", tryCatchWrap(UserController.GetAllUsers));
router.get("/getUserProfile", tryCatchWrap(UserController.GetUserProfile));

router.post(
  "/create",
  validate(userSchema),
  auditLogger,
  tryCatchWrap(UserController.CreateUserHandler)
);

router.post(
  "/assign-page-role",
  authenticateUser,
  requireSuperAdmin,
  auditLogger,
  tryCatchWrap(UserController.AssignRoleToWebpage)
);

router.delete(
  "/remove-page-role",
  authenticateUser,
  requireSuperAdmin,
  auditLogger,
  tryCatchWrap(UserController.RemoveRoleFromWebpage)
);

router.put(
  "/updateProfile",
  validate(updateUserSchema),
  auditLogger,
  tryCatchWrap(UserController.EditProfile)
);

router.put(
  "/updateProfileImage",
  upload.array("image", 1),
  mediaUploader,
  tryCatchWrap(UserController.EditProfileImage)
);

router.put(
  "/activate",
  requireSuperAdmin,
  auditLogger,
  tryCatchWrap(UserController.ActivateUser)
);

router.put(
  "/deactivate",
  requireSuperAdmin,
  auditLogger,
  tryCatchWrap(UserController.DeactivateUser)
);

router.get(
  "/getAllUserByRoleId/:roleId",
  tryCatchWrap(UserController.GetAllUsersByRoleId)
);
router.get("/userRoleType/:id", tryCatchWrap(UserController.UserRoleType));
router.get("/:id", tryCatchWrap(UserController.GetUserById));

router.put(
  "/updateUser/:id",
  validate(updateUserSchema),
  auditLogger,
  tryCatchWrap(UserController.EditUserDetails)
);

router.delete("/:id", requireSuperAdmin, UserController.DeleteUser);
router.patch(
  "/restore/:id",
  requireSuperAdmin,
  UserController.RestoreDeletedUser
);

export default router;
