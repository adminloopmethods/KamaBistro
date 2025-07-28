import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt.js";
import { logActivity } from "../utils/logger.js";

const prisma = new PrismaClient();

// Register a new user
export const register = async (req, res) => {
  try {
    const { email, name, phone, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      await logActivity({ action: "Register Failed", message: `User with email ${email} already exists.` });
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        role,
      },
    });

    await logActivity({ action: "User Registered", userId: newUser.id, message: `New user ${email} registered.` });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ message: "User registered successfully", user: safeUser });
  } catch (err) {
    await logActivity({ action: "Register Error", message: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Login existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email, deleted: false },
    });

    if (!user) {
      await logActivity({ action: "Login Failed", message: `User not found or deleted: ${email}` });
      return res.status(404).json({ message: "User not found or deleted." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      await logActivity({ action: "Login Failed", userId: user.id, message: `Invalid password attempt.` });
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    await logActivity({ action: "Login Success", userId: user.id, message: `User ${email} logged in.` });

    const { password: _, ...safeUser } = user;
    res.json({ message: "Login successful", token, user: safeUser });
  } catch (err) {
    await logActivity({ action: "Login Error", message: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Update user info
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, phone, password, role } = req.body;

    const data = {};
    if (email) data.email = email;
    if (name) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (role) data.role = role;
    if (password) data.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    await logActivity({ action: "User Updated", userId: updatedUser.id, message: `User ${updatedUser.email} updated.` });

    const { password: _, ...safeUser } = updatedUser;
    res.json({ message: "User updated", user: safeUser });
  } catch (err) {
    await logActivity({ action: "Update User Error", message: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Soft delete a user
export const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id },
      data: { deleted: true },
    });

    await logActivity({ action: "User Deleted", userId: user.id, message: `Soft-deleted user ${user.email}` });

    res.json({ message: "User deleted (soft delete applied)" });
  } catch (err) {
    await logActivity({ action: "Delete User Error", message: err.message });
    res.status(500).json({ error: err.message });
  }
};
