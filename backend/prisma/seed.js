// prisma/seed.js
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const SUPERUSER_EMAIL = process.env.SUPERUSER_EMAIL;
    const SUPERUSER_PASSWORD = process.env.SUPERUSER_PASSWORD;
    const SUPERUSER_NAME = process.env.SUPERUSER_NAME;


    if (!SUPERUSER_EMAIL || !SUPERUSER_PASSWORD) {
        throw new Error("❌ SUPERUSER_EMAIL or SUPERUSER_PASSWORD not found in .env file");
    }

    const hashedPassword = await bcrypt.hash(SUPERUSER_PASSWORD, 10);

    const existing = await prisma.user.findUnique({
        where: { email: SUPERUSER_EMAIL },
    });

    if (!existing) {
        await prisma.user.create({
            data: {
                email: SUPERUSER_EMAIL,
                password: hashedPassword,
                role: "ADMIN",
                name: SUPERUSER_NAME,
                status: true
            },
        });
        console.log("✅ Superuser created");
    } else {
        console.log("ℹ️ Superuser already exists");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
