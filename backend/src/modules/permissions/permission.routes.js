import {Router} from "express";
import PermissionController from "./permission.controller.js";
import validator from "../../validation/validator.js";
import {
  createPermissionSchema,
  createSubPermissionSchema,
} from "../../validation/permissionSchema.js";
import tryCatchWrap from "../../errors/tryCatchWrap.js";

const router = Router();

router.get("/permissions", tryCatchWrap(PermissionController.GetPermissions));

router.get(
  "/subPermissions",
  tryCatchWrap(PermissionController.GetSubPermissions)
);

router.get("/:id", tryCatchWrap(PermissionController.GetPermissionById));

router.get(
  "/subPermission",
  tryCatchWrap(PermissionController.GetSubPermissionByPermissionId)
);

router.get(
  "/permissionsByRoleType/:id",
  tryCatchWrap(PermissionController.GetPermissionsByRoleType)
);

router.post(
  "/create",
  validator(createPermissionSchema),
  tryCatchWrap(PermissionController.CreatePermission)
);
router.post(
  "/subPermission/create",
  validator(createSubPermissionSchema),
  tryCatchWrap(PermissionController.CreateSubPermission)
);

router.put(
  "/:id/update",
  validator(createPermissionSchema),
  tryCatchWrap(PermissionController.UpdatePermission)
);
router.put(
  "/subPermission/:id/update",
  validator(createSubPermissionSchema),
  tryCatchWrap(PermissionController.UpdateSubPermission)
);

export default router;
