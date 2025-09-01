import {Router} from "express";
import RolesController from "./roles.controller.js";
import {authenticateUser} from "../../helper/authMiddleware.js";
import validator from "../../validation/validator.js";
import {createRoleSchema} from "../../validation/rolesSchema.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";
import {checkPermission} from "../../helper/roleBasedAccess.js";
import auditLogger from "../../helper/auditLogger.js";

const router = Router();

const requiredPermissionsForRole = ["ROLES_PERMISSION_MANAGEMENT"];

router.get(
  "/allRoles",
  authenticateUser,
  tryCatchWrap(RolesController.getRole)
);

// router.get("/roles", tryCatchWrap(RolesController.GetRoles));

router.get("/roleType", tryCatchWrap(RolesController.GetRoleType));

router.get(
  "/:id",
  checkPermission(requiredPermissionsForRole),
  tryCatchWrap(RolesController.GetRoleById)
);

router.post(
  "/create",
  checkPermission(requiredPermissionsForRole),
  validator(createRoleSchema),
  auditLogger,
  tryCatchWrap(RolesController.CreateRole)
);

router.put(
  "/update/:id",
  checkPermission(requiredPermissionsForRole),
  auditLogger,
  tryCatchWrap(RolesController.UpdateRole)
);

router.put(
  "/activate",
  checkPermission(requiredPermissionsForRole),
  auditLogger,
  tryCatchWrap(RolesController.ActivateRole)
);

router.put(
  "/deactivate",
  checkPermission(requiredPermissionsForRole),
  auditLogger,
  tryCatchWrap(RolesController.DeactivateRole)
);

router.get(
  "/role-by-name/:name",
  authenticateUser,
  tryCatchWrap(RolesController.GetRoleByName)
);

export default router;
