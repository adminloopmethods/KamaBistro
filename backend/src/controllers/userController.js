import {
  getAllNonAdminUsers,
  getNonAdminUserById,
  updateUserById,
  softDeleteUserById,
  createUser,
  checkIfUserExists,
  toggleUserStatusById,
} from "../service/userServices.js";

import { validatePasswordFields } from "../utils/userHelper.js";
import { logActivity } from "../utils/logger.js";
import { userMessages } from "../constants/messages.js";

// Get all non-admin users
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllNonAdminUsers();
    await logActivity({ action: "Get All Users", message: userMessages.USER_LIST_FETCHED });
    res.json({ users });
  } catch (err) {
    await logActivity({ action: "Get All Users Error", message: err.message });
    res.status(500).json({ message: "Failed to fetch user list." });
  }
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { email, name, phone, password, cnfmpassword, role } = req.body;

    await checkIfUserExists(email);
    validatePasswordFields(password, cnfmpassword);

    const newUser = await createUser({
      email: email.toLowerCase(),
      name,
      phone,
      password,
      role,
    });

    await logActivity({
      action: "User Registered",
      userId: newUser.id,
      message: `New user ${email} registered.`,
    });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ message: "User registered successfully", user: safeUser });

  } catch (err) {
    await logActivity({ action: "Register Error", message: err.message });
    res.status(400).json({ message: err.message || "Registration failed." });
  }
};

// Get a user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getNonAdminUserById(id);

    if (!user) {
      await logActivity({ action: "Get User Failed", userId: id, message: userMessages.USER_NOT_FOUND });
      return res.status(404).json({ message: userMessages.USER_NOT_FOUND });
    }

    const { password: _, ...safeUser } = user;

    await logActivity({
      action: "Get User",
      userId: id,
      message: userMessages.USER_FETCHED(user.email),
    });

    res.json({ user: safeUser });
  } catch (err) {
    await logActivity({ action: "Get User Error", message: err.message });
    res.status(500).json({ message: "Failed to fetch user." });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUserById(id, req.body);
    const { password: _, ...safeUser } = updatedUser;

    await logActivity({
      action: "User Updated",
      userId: updatedUser.id,
      message: userMessages.USER_UPDATED(updatedUser.email),
    });

    res.json({ message: "User updated", user: safeUser });
  } catch (err) {
    let status = 500;
    let message = "An error occurred while updating the user.";

    if (err.message === "User not found.") {
      status = 404;
      message = "User not found.";
    } else if (err.message === "No valid fields provided for update.") {
      status = 400;
      message = err.message;
    }

    await logActivity({
      action: "Update User Error",
      message: err.message,
    });

    res.status(status).json({ message });
  }
};

// Soft-delete a user
export const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await softDeleteUserById(id);

    await logActivity({
      action: "User Deleted",
      userId: user.id,
      message: userMessages.USER_DELETED(user.email),
    });

    res.json({ message: userMessages.USER_DELETED(user.email) });

  } catch (err) {
    await logActivity({ action: "Delete User Error", message: err.message });

    // If user was not found or already deleted
    if (err.message === "User not found.") {
      return res.status(404).json({ message: userMessages.USER_NOT_FOUND });
    }

    res.status(500).json({ message: "Failed to delete user." });
  }
};


export const toggleStatus = async (req, res) => {

  const { id } = req.params;

  try {
    const updatedUser = await toggleUserStatusById(id);
    const { password: _, ...safeUser } = updatedUser;

    await logActivity({
      action: "User Status Toggled",
      userId: updatedUser.id,
      message: `User status changed to ${updatedUser.isActive ? "Active" : "Inactive"}`,
    });

    res.json({
      message: `User status changed to ${updatedUser.isActive ? "Active" : "Inactive"}`,
      user: safeUser,
    });

  } catch (err) {
    await logActivity({
      action: "Toggle User Status Error",
      message: err.message,
    });

    const status = err.message === "User not found." ? 404 : 500;
    res.status(status).json({ message: err.message || "Failed to toggle user status." });
  }
}