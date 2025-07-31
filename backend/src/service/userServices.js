// userServices.js
import bcrypt from "bcrypt";
import prisma from "../models/prismaClient.js";
import { validatePasswordStructure } from "../utils/userHelper.js";
import { userMessages } from "../constants/messages.js";

export const checkIfUserExists = async (email) => {
    const user = await prisma.user.findFirst({
        where: {
            email: email.toLowerCase(),
            deleted: false,
            role: {
                not: "ADMIN",
            },
        },
    });
    if (user) {
        throw new Error(userMessages.USER_ALREADY_EXISTS);
    }
};

export const createUser = async ({ name, email, phone, role, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
        data: {
            name,
            email: email.toLowerCase(),
            phone,
            role,
            password: hashedPassword,
        },
    });
};

export const getAllNonAdminUsers = async () => {
    return await prisma.user.findMany({
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

export const getNonAdminUserById = async (id) => {
    const user = await prisma.user.findFirst({
        where: {
            id,
            deleted: false,
            role: { not: "ADMIN" },
        },
    });
    return user;
};

export const updateUserById = async (id, data) => {
    
    const updateData = {};

    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.role && data.role !== "ADMIN") updateData.role = data.role;

    if (data.password) {
        const isValid = validatePasswordStructure(data.password);
        if (isValid !== true) throw new Error(isValid);
        updateData.password = await bcrypt.hash(data.password, 10);
    }

    if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields provided for update.");
    }

    return await prisma.user.update({
        where: { id },
        data: updateData,
    });
};

export const softDeleteUserById = async (id) => {
    return await prisma.user.update({
        where: { id },
        data: { deleted: true },
    });
};

export const findActiveUserByEmail = async (email) => {
    return await prisma.user.findFirst({
        where: {
            email: email.toLowerCase(),
            deleted: false,
            role: {
                not: "ADMIN",
            },
        },
    });
};

export const isPasswordValid = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
