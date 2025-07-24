import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Don't return password in response
    const { password: _, ...safeUser } = newUser;

    res.status(201).json({ message: "User registered successfully", user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email, deleted: false },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    const { password: _, ...safeUser } = user;

    res.json({ message: "Login successful", token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    const data = {};
    if (email) data.email = email;
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

export const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.update({
      where: { id },
      data: { deleted: true },
    });

    res.json({ message: "User deleted (soft)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
