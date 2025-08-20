// import prisma from "../../helper/db.js";
import {
  createUserHandler,
  fetchAllUsers,
  updateUser,
  findUserById,
  userActivation,
  userDeactivation,
  findRoleTypeByUserId,
  fetchAllRolesForUser,
  fetchAllUsersByRoleId,
  updateProfile,
  updateProfileImage,
  assignPageRole,
  fetchAllLocations,
} from "../../repository/user.repository.js";
import {assert, assertEvery} from "../../errors/assertError.js";
import {logger} from "../../config/logConfig.js";

const createUser = async (name, email, password, phone, locationId) => {
  const user = await createUserHandler(
    name,
    email,
    password,
    phone,
    locationId
  );
  // logger.info({response: "user created successfully", user: user});
  return {message: "user created successfully", user};
};

const getAllUsers = async (name, email, phone, status, page, limit) => {
  const users = await fetchAllUsers(name, email, phone, status, page, limit);
  // logger.info({response: "user fetched successfully", users: users});
  return {message: "user fetched successfully", users};
};

const AssignPageRole = async (userId, webpageId, roleId) => {
  try {
    return await assignPageRole(userId, webpageId, roleId);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      assert(
        error.code === "P2002",
        "CONFLICT_ERROR",
        "This role is already assigned to this user on this page"
      );
      assert(
        error.code === "P2025",
        "NOT_FOUND",
        "User, webpage, or role not found"
      );
    }
    throw error;
  }
};

const getAllRolesForUser = async () => {
  const roles = await fetchAllRolesForUser();
  return {message: "user roles fetched successfully", roles};
};

const getUserById = async (id) => {
  const user = await findUserById(id); // to bring the roles
  assert(user, "NOT_FOUND", "user not found");
  // logger.info({response: "user fetched successfully", user: user});
  return {message: "user fetched successfully", user};
};

const editUserDetails = async (id, name, password, phone, locationId) => {
  let result = await updateUser(id, name, password, phone, locationId);
  return {message: "User updated Successfully", result}; // changed for message to show at frontend at apr 7 11:32
};

const editProfile = async (id, name, phone, image) => {
  let result = await updateProfile(id, name, phone, image);
  return {message: "User updated Successfully", result}; // changed for message to show at frontend at apr 7 11:32
};

const getAllUsersByRoleId = async (roleId) => {
  const users = await fetchAllUsersByRoleId(roleId);
  assert(users, "NOT_FOUND", "users not found");
  return {message: "users fetched successfully", users};
};

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({where: {email}});
};

const activateUsers = async (id) => {
  const user = await userActivation(id);
  assert(user, "USER_INVALID", "user not found");
  // logger.info({response: `user ${id} is active now`});
  return {
    message: "User activated successfully",
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      location: user.location,
    },
  }; // if everything goes fine
};

const deactivateUsers = async (id) => {
  const user = await userDeactivation(id);
  assert(user, "USER_INVALID", "user not found");
  // logger.info({response: `user ${id} is deactive now`});
  console.log("user", user);
  return {
    message: "User deactivated successfully",
    ok: true,
    status: user.status,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      location: user.location,
    },
  }; // if everything goes fine
};

const userRoleType = async (id) => {
  const roleType = await findRoleTypeByUserId(id);
  assert(roleType, "ROLETYPE_INVALID", "roleType not found");
  // logger.info({response: `roleType fetched successfully`});
  return {message: "RoleType fetched successfully", roleType}; // if everything goes fine
};

const editProfileImage = async (id, imageUrl) => {
  const profileImage = await updateProfileImage(id, imageUrl);
  assert(profileImage, "IMAGE_UPDATE_FAILED", "Profile image update failed");
  // logger.info({response: `Profile image updated successfully`});
  return {message: "Profile image updated successfully", profileImage};
};

const getAllLocations = async () => {
  const location = await fetchAllLocations();
  return {message: "Location fetched successfully", location};
};

export {
  createUser,
  AssignPageRole,
  findUserByEmail,
  getAllUsers,
  getUserById,
  editUserDetails,
  editProfile,
  activateUsers,
  deactivateUsers,
  userRoleType,
  getAllRolesForUser,
  getAllUsersByRoleId,
  editProfileImage,
  getAllLocations,
};
