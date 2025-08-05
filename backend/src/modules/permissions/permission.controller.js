import {
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  getSubPermissions,
  getSubPermissionByPermissionId,
  createSubPermission,
  updateSubPermission,
  getPermissionsByRoleType,
} from "./permission.service.js";

const GetPermissions = async (req, res) => {
  const response = await getPermissions();
  res.status(200).json(response);
};

const GetSubPermissions = async (req, res) => {
  const response = await getSubPermissions();
  res.status(200).json(response);
};

const GetPermissionById = async (req, res) => {
  const {id} = req.params;
  const response = await getPermissionById(id);
  res.status(200).json(response);
};

const GetPermissionsByRoleType = async (req, res) => {
  const {id} = req.params;
  console.log(id);
  const response = await getPermissionsByRoleType(id);
  res.status(200).json(response);
};

const GetSubPermissionByPermissionId = async (req, res) => {
  const {permissionId} = req.query;
  const response = await getSubPermissionByPermissionId(permissionId);
  res.status(200).json(response);
};

const CreatePermission = async (req, res) => {
  const {name, description, roleTypeId, subPermissions} = req.body;
  const response = await createPermission(
    name,
    description,
    roleTypeId,
    subPermissions
  );
  res.status(201).json(response);
};

const CreateSubPermission = async (req, res) => {
  const {name, description} = req.body;
  const response = await createSubPermission(
    name,
    description,
    roleTypeId,
    subPermissions
  );
  res.status(201).json(response);
};

const UpdatePermission = async (req, res) => {
  const {id} = req.params;
  const {name, description, roleTypeId, subPermissions} = req.body;
  const response = await updatePermission(
    id,
    name,
    description,
    roleTypeId,
    subPermissions
  );
  res.status(200).json(response);
};

const UpdateSubPermission = async (req, res) => {
  const {id} = req.params;
  const {name, description} = req.body;
  const response = await updateSubPermission(id, name, description);
  res.status(200).json(response);
};

export default {
  // Permissions
  GetPermissions,
  GetPermissionById,
  CreatePermission,
  UpdatePermission,

  // SubPermissions
  GetSubPermissions,
  GetSubPermissionByPermissionId,
  CreateSubPermission,
  UpdateSubPermission,

  GetPermissionsByRoleType,
};
