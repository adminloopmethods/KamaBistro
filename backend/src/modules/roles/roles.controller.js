// import {eventEmitter} from "../../helper/event.js";
import {getSocketId} from "../../helper/socketConnectionID.js";
import {createNotification} from "../../repository/notification.repository.js";
import {fetchAllUsersByRoleId} from "../../repository/user.repository.js";
import {
  getRoles,
  getRoleById,
  getRoleType,
  createRole,
  activateRoles,
  deactivateRoles,
  updateRole,
} from "./roles.service.js";
import {handleEntityCreationNotification} from "../../helper/notificationHelper.js";
import prismaClient from "../../config/dbConfig.js";

// const GetRoles = async (req, res) => {
//   const {search, status, page, limit} = req.query;
//   const pageNum = parseInt(page) || 1;
//   const limitNum = parseInt(limit) || 10;
//   const response = await getRoles(search, status, pageNum, limitNum);
//   res.status(200).json(response);
// };

const GetRoleById = async (req, res) => {
  const {id} = req.params;
  const response = await getRoleById(id);
  res.status(200).json(response);
};

const GetRoleType = async (req, res) => {
  const response = await getRoleType();
  res.status(200).json(response);
};

const CreateRole = async (req, res) => {
  const {name, roleTypeId, permissions} = req.body;
  const result = await createRole(name, roleTypeId, permissions);
  res.locals.entityId = result.newRole.roles.id;
  res.status(201).json(result);
  // Notification: role created
  const io = req.app.locals.io;
  await handleEntityCreationNotification({
    io,
    userId: req.user?.id,
    entity: "role",
    newValue: result.newRole.roles,
    actionType: "CREATE",
  });
};

const UpdateRole = async (req, res) => {
  const {id} = req.params;
  const {name, roleTypeId, permissions} = req.body;
  const result = await updateRole(id, name, roleTypeId, permissions);
  const io = req.app.locals.io; // Get socket.io instance
  // Notification: role updated
  await handleEntityCreationNotification({
    io,
    userId: req.user?.id,
    entity: "role",
    newValue: result.role,
    actionType: "UPDATE",
  });

  const users = await fetchAllUsersByRoleId(id);
  users.forEach((el) => {
    const socketIdOfUpdatedUser = getSocketId(el.id);
    if (socketIdOfUpdatedUser) {
      io.to(socketIdOfUpdatedUser).emit("userUpdated", {result: el});
    }
  });

  res.status(202).json(result);
};

const ActivateRole = async (req, res) => {
  const {id} = req.body;
  const result = await activateRoles(id);
  const io = req.app.locals.io; // Get socket.io instance
  const users = await fetchAllUsersByRoleId(id);
  users.forEach((el) => {
    const socketIdOfUpdatedUser = getSocketId(el.id);
    if (socketIdOfUpdatedUser) {
      io.to(socketIdOfUpdatedUser).emit("userUpdated", {result: el});
    }
  });
  res.status(200).json(result);
};

const DeactivateRole = async (req, res) => {
  const {id} = req.body;
  const result = await deactivateRoles(id);
  const io = req.app.locals.io; // Get socket.io instance
  const users = await fetchAllUsersByRoleId(id);
  users.forEach((el) => {
    const socketIdOfUpdatedUser = getSocketId(el.id);
    if (socketIdOfUpdatedUser) {
      io.to(socketIdOfUpdatedUser).emit("userUpdated", {result: el});
    }
  });
  res.status(200).json(result);
};

const getRole = async (req, res) => {
  try {
    const roles = await prismaClient.role.findMany({
      where: {status: "ACTIVE"},
    });

    res.status(200).json({
      success: true,
      roles: roles,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const GetRoleByName = async (req, res) => {
  try {
    const {name} = req.params;
    const role = await prismaClient.role.findFirst({
      where: {
        name: name.toUpperCase(),
        status: "ACTIVE",
      },
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: `Role '${name}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      role: role,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  // GetRoles,
  GetRoleById,
  GetRoleType,
  CreateRole,
  ActivateRole,
  DeactivateRole,
  UpdateRole,
  getRole,
  GetRoleByName,
};
