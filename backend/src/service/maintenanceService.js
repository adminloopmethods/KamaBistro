import prisma from "../models/prismaClient.js";

// Delete all users
export const deleteAllUsersService = async () => {
  return await prisma.user.deleteMany();
};

// Delete all content-related records
export const deleteAllContentService = async () => {
  // Delete in correct order due to foreign key constraints
  await prisma.style.deleteMany();
  await prisma.element.deleteMany();
  await prisma.content.deleteMany();
  return await prisma.webpage.deleteMany();
};

// Delete users and content together
export const nukeAllUsersAndContentService = async () => {
  await prisma.style.deleteMany();
  await prisma.element.deleteMany();
  await prisma.content.deleteMany();
  await prisma.webpage.deleteMany();
  return await prisma.user.deleteMany();
};
