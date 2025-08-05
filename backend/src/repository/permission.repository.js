import prismaClient from "../config/dbConfig.js";

export const findPermissions = async () => {
  return await prismaClient.permission.findMany();
};

export const findSubPermissions = async () => {
  return await prismaClient.subPermission.findMany();
};

export const findSubPermissionById = async (permissionId) => {
  // console.log("Fetching subpermissions for permissionId:", id); // Debug log

  const subPermissions = await prismaClient.permissionSubPermission.findMany({
    where: {permissionId: permissionId},
    // include: {subPermission: true}, // Ensure we get subPermission details
  });

  // console.log("Fetched SubPermissions:", subPermissions); // Debug log

  if (!subPermissions || subPermissions.length === 0) {
    // console.log("No subpermissions found for permissionId:", id);
    return false; // Return false if empty
  }

  return subPermissions;
};

export const findRoleById = async (id) => {
  const role = await prismaClient.role.findUnique({
    where: {
      id: id,
    },
  });
  // Check if the role is "SUPER_ADMIN"
  if (role && role.name === "SUPER_ADMIN") return null; // Return null if the role is "SUPER_ADMIN"
  return role; // Otherwise, return the role
};

export const createNewRoles = async (name, description) => {
  // making the query to create role
  const roles = await prismaClient.role.create({
    data: {
      name,
      description,
    },
  });

  if (!roles) return false; // for handling the assert through false

  return {roles};
};

export const findAllPermissionsByRoleType = async (id) => {
  const existingRoleType = await prismaClient.roleType.findUnique({
    where: {id: id},
  });

  if (!existingRoleType) return false;

  const permissions = await prismaClient.permission.findMany({
    where: {roleTypeId: id},
  });

  return permissions;
};

export const roleActivation = async (id) => {
  const role = await prismaClient.role.update({
    where: {
      id: id,
    },
    data: {
      status: "ACTIVE",
    },
  });

  return role;
};

export const roleDeactivation = async (id) => {
  const role = await prismaClient.role.update({
    where: {
      id: id,
    },
    data: {
      status: "INACTIVE",
    },
  });

  return role;
};

export const updateRoleinDB = async (id, updateObj) => {
  // confirming the for the role to exist
  const confirmRole = await findRoleById(id);

  if (!confirmRole) return false;

  console.log(updateObj);
  const role = prismaClient.role.update({
    where: {id: id},
    data: updateObj,
  });

  return role;
};
