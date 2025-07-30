import bcrypt from "bcrypt";
import { logActivity } from "../utils/logger.js";
import {
  getAllNonAdminUsers,
  getNonAdminUserById,
  updateUserById,
  softDeleteUserById,
} from "../service/userServices.js";
// import { userMessages } from "../constants/messages.js";

// Get all users (excluding ADMINs and deleted)
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllNonAdminUsers();
    await logActivity({ action: "Get All Users", message: userMessages.USER_LIST_FETCHED });
    res.json({ users });
  } catch (err) {
    await logActivity({ action: "Get All Users Error", message: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { email, name, phone, password, role } = req.body;

    await existingUser(req, res, email) // if user exist it will exit the and respons with 400

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({ email, name, phone, password: hashedPassword, role, });

    await logActivity({ action: "User Registered", userId: newUser.id, message: `New user ${email} registered.` });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ message: "User registered successfully", user: safeUser });
  } catch (err) {
    await logActivity({ action: "Register Error", message: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Get a single user by ID (if not ADMIN or deleted)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getNonAdminUserById(id);

    if (!user) {
      await logActivity({ action: "Get User Failed", userId: id, message: userMessages.USER_NOT_FOUND });
      return res.status(404).json({ message: userMessages.USER_NOT_FOUND });
    }

    const { password: _, ...safeUser } = user;
    await logActivity({ action: "Get User", userId: id, message: userMessages.USER_FETCHED(user.email) });
    res.json({ user: safeUser });
  } catch (err) {
    await logActivity({ action: "Get User Error", message: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Update a user (with optional password hash)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await updateUserById(id, req.body);

    const { password: _, ...safeUser } = updatedUser;
    await logActivity({ action: "User Updated", userId: updatedUser.id, message: `Updated user ${updatedUser.email}` });
    res.json({ message: "User updated", user: safeUser });
  } catch (err) {
    await logActivity({ action: "Update User Error", message: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Soft delete a user (mark as deleted)
export const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await softDeleteUserById(id);

    await logActivity({ action: "User Deleted", userId: user.id, message: userMessages.USER_DELETED(user.email) });
    res.json({ message: userMessages.USER_DELETED(user.email) });
  } catch (err) {
    await logActivity({ action: "Delete User Error", message: err.message });
    res.status(500).json({ error: err.message });
  }
};
