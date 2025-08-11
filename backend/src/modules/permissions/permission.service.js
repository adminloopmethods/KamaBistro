import {logger} from "../../config/index.js";
import {assert, assertEvery} from "../../errors/assertError.js";
import {
  findPermissions,
  findSubPermissions,
  // findPermissionById,
  findSubPermissionById,
  // addPermission,
  // addSubPermission,
  // getPermissionsByRoleType,
  // editPermission,
  // editSubPermission,
  findAllPermissionsByRoleType,
} from "../../repository/permission.repository.js";

const getPermissions = async () => {
  const permissions = await findPermissions(); // to bring the roles
  logger.info({
    response: "Permissions fetched successfully",
    permissions: permissions,
  });
  return {message: "Permissions fetched successfully", permissions};
};

const getSubPermissions = async () => {
  const subPermissions = await findSubPermissions(); // to bring the roles
  logger.info({
    response: "sub permissions fetched successfully",
    subPermissions: subPermissions,
  });
  return {message: "Sub permissions fetched successfully", subPermissions};
};

const getPermissionById = async (id) => {
  const role = await findRoleById(id); // to bring the roles
  assert(role, "NOT_FOUND", "Role not found");
  logger.info({response: "roles fetched successfully", role: role});
  return {message: "Role fetched successfully", role};
};

const getSubPermissionByPermissionId = async (permissionId) => {
  const subPermission = await findSubPermissionById(permissionId);
  assert(subPermission, "NOT_FOUND", "sub permission not found");
  logger.info({
    response: "sub permission fetched successfully",
    subPermission: subPermission,
  });
  return {message: "Sub permission fetched successfully", subPermission};
};

const getPermissionsByRoleType = async (id) => {
  const permission = await findAllPermissionsByRoleType(id);
  assert(permission, "NOT_FOUND", "permissions not found");
  logger.info({
    response: "permissions fetched successfully",
    permission: permission,
  });
  return {message: "permissions fetched successfully", permission};
};

const createPermission = async (data) => {
  const newRole = await createNewRoles(data.name, data.description);

  // if response is empty the throw error with assert
  assert(newRole, "CREATION_FAILED", "something went wrong");

  //log information
  logger.info({response: "logged in successfully"});

  return {message: "Role created successfully", newRole, ok: true}; // if everything goes fine
};

const createSubPermission = async (data) => {
  const newRole = await createNewRoles(data.name, data.description);

  // if response is empty the throw error with assert
  assert(newRole, "CREATION_FAILED", "something went wrong");

  //log information
  logger.info({response: "logged in successfully"});

  return {message: "Role created successfully", newRole, ok: true}; // if everything goes fine
};

const updatePermission = async (id, updateObject) => {
  const role = await updateRoleinDB(id, updateObject);

  assert(role, "ROLE_INVALID", "Role not found");

  logger.info({response: `role ${id} is inactive now`});

  return {message: "Role updated successfully", role, ok: true};
};

const updateSubPermission = async (id, updateObject) => {
  const role = await updateRoleinDB(id, updateObject);

  assert(role, "ROLE_INVALID", "Role not found");

  logger.info({response: `role ${id} is inactive now`});

  return {message: "Role updated successfully", role, ok: true};
};

export {
  // Permissions

  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,

  // SubPermissions
  getSubPermissions,
  getSubPermissionByPermissionId,
  createSubPermission,
  updateSubPermission,
  // addPermission,
  getPermissionsByRoleType,
};
