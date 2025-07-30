import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import bcrypt from "bcrypt";


// All non-admin, not-deleted users
export const getAllNonAdminUsers = async () => {
    return prisma.user.findMany({
        where: {
            role: { not: "ADMIN" },
            deleted: false,
        },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            role: true,
            status: true, 
            createdAt: true,
            updatedAt: true,
        },
    });
};


// Get user by ID if not deleted or admin
export const getNonAdminUserById = async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.deleted || user.role === "ADMIN") return null;
    return user;
};

// Update user logic (skip ADMIN)
export const updateUserById = async (id, data) => {
    const updateData = {};

    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.role && data.role !== "ADMIN") updateData.role = data.role;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

    return await prisma.user.update({
        where: { id },
        data: updateData,
    });
};

// Soft delete (mark as deleted)
export const softDeleteUserById = async (id) => {
    return await prisma.user.update({
        where: { id },
        data: { deleted: true },
    });
};
