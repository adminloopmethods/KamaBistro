import prisma from "../models/prismaClient.js";

// Delete all users
export const deleteAllUsers = async (req, res) => {
  try {
    await prisma.user.deleteMany();
    res.json({ message: "All users deleted." });
  } catch (err) {
    console.error("Error deleting users:", err);
    res.status(500).json({ error: "Failed to delete users." });
  }
};

// Delete all content-related records
export const deleteAllContent = async (req, res) => {
  try {
    // Delete in correct order due to foreign key constraints
    await prisma.style.deleteMany();
    await prisma.element.deleteMany();
    await prisma.content.deleteMany();
    await prisma.webpage.deleteMany();

    res.json({ message: "All content-related data deleted." });
  } catch (err) {
    console.error("Error deleting content:", err);
    res.status(500).json({ error: "Failed to delete content." });
  }
};

// Delete users and content together
export const nukeAllUsersAndContent = async (req, res) => {
  try {
    await prisma.style.deleteMany();
    await prisma.element.deleteMany();
    await prisma.content.deleteMany();
    await prisma.webpage.deleteMany();
    await prisma.user.deleteMany();

    res.json({ message: "All users and content-related data deleted." });
  } catch (err) {
    console.error("Error nuking everything:", err);
    res.status(500).json({ error: "Failed to nuke database." });
  }
};
