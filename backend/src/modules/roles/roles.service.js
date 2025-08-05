import {logger} from "../../config/index.js";
import {assert, assertEvery} from "../../errors/assertError.js";
import {
  findRoles,
  findRoleById,
  createNewRoles,
  roleActivation,
  roleDeactivation,
  findRoleType,
  updateRoleById,
} from "../../repository/role.repository.js";

const getRoles = async (searchTerm, status, page, limit) => {
  const roles = await findRoles(searchTerm, status, page, limit); // to bring the roles
  logger.info({response: "roles fetched successfully", roles: roles});
  return {message: "Roles fetched successfully", roles};
};

const getRoleById = async (id) => {
  const role = await findRoleById(id); // to bring the roles
  assert(role, "NOT_FOUND", "Role not found");
  logger.info({response: "roles fetched successfully", role: role});
  return {message: "Role fetched successfully", role};
};

const getRoleType = async () => {
  const roleType = await findRoleType();
  assert(roleType, "NOT_FOUND", "Role type not found");
  logger.info({
    response: "roles types fetched successfully",
    roleType: roleType,
  });
  return {message: "Role types fetched successfully", roleType};
};

const createRole = async (name, roleTypeId, permissions) => {
  const newRole = await createNewRoles(name, roleTypeId, permissions);

  // if response is empty the throw error with assert
  assert(newRole, "CREATION_FAILED", "something went wrong");

  //log information
  logger.info({response: "logged in successfully"});

  return {message: "Role created successfully", newRole, ok: true}; // if everything goes fine
};

const activateRoles = async (id) => {
  const role = await roleActivation(id);

  assert(role, "ROLE_INVALID", "Role not found");

  logger.info({response: `role ${id} is active now`});

  return {message: "Role activated successfully", ok: true}; // if everything goes fine
};

const deactivateRoles = async (id) => {
  const role = await roleDeactivation(id);

  assert(role, "ROLE_INVALID", "Role not found");

  logger.info({response: `role ${id} is inactive now`});

  return {message: "Role deactivated successfully", ok: true}; // if everything goes fine
};



const updateRole = async (id, roleName, roleTypeId, permissions) => {
  const role = await updateRoleById(id, roleName, roleTypeId, permissions);

  assert(role, "ROLE_INVALID", "Role not found");

  logger.info({response: `role ${roleName} updated successfully`});

  return {message: "Role updated successfully", role, ok: true};
};

export {
  getRoles,
  getRoleById,
  getRoleType,
  createRole,
  activateRoles,
  deactivateRoles,
  updateRole,
};
