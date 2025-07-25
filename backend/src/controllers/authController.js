import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

// Register a new user
export const register = async (req, res) => {
  try {
    const { email, name, phone, password, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        role, // optional: you can restrict allowed roles manually here too
      },
    });

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ message: "User registered successfully", user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find active (non-deleted) user
    const user = await prisma.user.findFirst({
      where: {
        email,
        deleted: false,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found or deleted." });
    }

    // Compare passwords
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...safeUser } = user;
    res.json({ message: "Login successful", token, user: safeUser });
  } catch (err) {
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

    const { password: _, ...safeUser } = updatedUser;
    res.json({ message: "User updated", user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Soft delete a user
export const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.update({
      where: { id },
      data: { deleted: true },
    });

    res.json({ message: "User deleted (soft delete applied)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
