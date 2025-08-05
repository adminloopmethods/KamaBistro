import {getSocketId} from "../../helper/socketConnectionID.js";
import {
  activateUsers,
  createUser,
  deactivateUsers,
  editProfile,
  editProfileImage,
  editUserDetails,
  getAllRolesForUser,
  getAllUsers,
  getAllUsersByRoleId,
  getUserById,
  userRoleType,
} from "./user.service.js";
import { handleEntityCreationNotification } from "../../helper/notificationHelper.js";

const CreateUserHandler = async (req, res) => {
  const {name, email, password, phone, roles} = req.body;
  const user = await createUser(name, email, password, phone, roles);
  res.locals.entityId = user.user.id;
  res.status(201).json(user);
  // Notification: user created
  const io = req.app.locals.io;
  await handleEntityCreationNotification({
    io,
    userId: req.user?.id || user.user.id, // fallback to created user if no actor
    entity: "user",
    newValue: user.user,
    actionType: "CREATE",
    targetUserId: user.user.id,
  });
};

const GetAllUsers = async (req, res) => {
  const {name, email, phone, status, page, limit} = req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 40;
  const allUser = await getAllUsers(
    name,
    email,
    phone,
    status,
    pageNum,
    limitNum
  );
  res.status(201).json(allUser);
};

const GetUserById = async (req, res) => {
  const {id} = req.params;
  const response = await getUserById(id);
  res.status(200).json(response);
};

const GetUserProfile = async (req, res) => {
  const {id} = req.user;
  const user = await getUserById(id);
  res.status(200).json(user);
};

const GetAllUsersByRoleId = async (req, res) => {
  const {roleId} = req.params;
  const allUser = await getAllUsersByRoleId(roleId);
  res.status(201).json(allUser);
};

const EditUserDetails = async (req, res) => {
  const {id} = req.params;
  const {name, password, phone, roles} = req.body;
  const updatedUser = await editUserDetails(id, name, password, phone, roles);
  const io = req.app.locals.io;
  // Notification: user updated
  await handleEntityCreationNotification({
    io,
    userId: req.user?.id,
    entity: "user",
    newValue: updatedUser.result,
    actionType: "UPDATE",
    targetUserId: id,
  });
  const socketIdOfUpdatedUser = getSocketId(id);
  io.to(socketIdOfUpdatedUser).emit("userUpdated", updatedUser);
  res.status(201).json(updatedUser);
};

const EditProfile = async (req, res) => {
  const {id} = req.user;
  const {name, phone, image} = req.body;
  const updatedUser = await editProfile(id, name, phone, image);
  res.status(201).json(updatedUser);
};

const ActivateUser = async (req, res) => {
  const {id} = req.body;
  const result = await activateUsers(id);
  res.status(200).json(result);
};

const DeactivateUser = async (req, res) => {
  const {id} = req.body;
  const result = await deactivateUsers(id);
  const io = req.app.locals.io;
  const socketIdOfUpdatedUser = getSocketId(id);
  io.to(socketIdOfUpdatedUser).emit("userUpdated", {result});
  res.status(200).json(result);
};

const GetRolesForUser = async (req, res) => {
  const result = await getAllRolesForUser();
  res.status(200).json(result);
};

const UserRoleType = async (req, res) => {
  const {id} = req.params;
  const result = await userRoleType(id);
  res.status(200).json(result);
};

const EditProfileImage = async (req, res) => {
  const {id} = req.user;
  if (!req.uploadedImages || req.uploadedImages.length === 0) {
    return res.status(400).json({error: "No uploadedImages found"});
  }
  const {public_id: imageUrl} = req.uploadedImages[0];
  if (!imageUrl) {
    return res.status(400).json({error: "Cloudinary did not return a URL"});
  }
  const updatedUser = await editProfileImage(id, imageUrl);
  res.status(201).json(updatedUser);
};

export default {
  CreateUserHandler,
  GetAllUsers,
  GetUserById,
  EditUserDetails,
  EditProfile,
  ActivateUser,
  DeactivateUser,
  UserRoleType,
  GetRolesForUser,
  GetAllUsersByRoleId,
  GetUserProfile,
  EditProfileImage,
};
