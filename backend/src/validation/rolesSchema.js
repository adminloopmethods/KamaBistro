import Joi from "joi";

const nameRule = Joi.string().min(3).max(30).required();
// const descriptionRule = Joi.string();
const roleTypeIdRule = Joi.string().required();

const permissionsRule = Joi.array().items(Joi.string()).required(); // Array of string permissions

const createRoleSchema = Joi.object({
  name: nameRule,
  // description: descriptionRule,
  roleTypeId: roleTypeIdRule,
  permissions: permissionsRule,
});

export {createRoleSchema};
