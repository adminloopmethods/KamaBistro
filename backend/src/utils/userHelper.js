import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

export const findActiveUserByEmail = async (email) => {
    return await prisma.user.findFirst({
        where: {
            email,
            deleted: false,
        },
    });
};

export const validatePassword = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
}

export const existingUser = async (req, res, email) => {
    console.log(email)
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        await logActivity({ action: "Register Failed", message: `User with email ${email} already exists.` });
        return res.status(400).json({ message: "User already exists." });
    }
}

export const createUser = async (userObject) => {
    return await prisma.user.create({
        data: userObject,
    });
}

export const findingAllUsers = async () => {

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
            createdAt: true,
            updatedAt: true,
        },
    })
}