import Joi from "joi";

const nameRule = Joi.string().min(3).max(30).required();
const descriptionRule = Joi.string();
const roleTypeIdRule = Joi.string().required();
const subPermissionsRule = Joi.array().items(Joi.string()).required(); // Array of string permissions

const createPermissionSchema = Joi.object({
  name: nameRule,
  description: descriptionRule,
  roleTypeId: roleTypeIdRule,
  subPermissions: subPermissionsRule,
});

const createSubPermissionSchema = Joi.object({
  name: nameRule,
  description: descriptionRule,
});

export { createPermissionSchema, createSubPermissionSchema };
