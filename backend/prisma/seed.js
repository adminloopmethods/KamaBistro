// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const SUPERUSER_EMAIL = "anukool.singh@loopmethods.com";
    const SUPERUSER_PASSWORD = "Anukool@123";

    // Hash password
    const hashedPassword = await bcrypt.hash(SUPERUSER_PASSWORD, 10);

    // Check if superuser already exists
    const existing = await prisma.user.findUnique({
        where: { email: SUPERUSER_EMAIL },
    });

    if (!existing) {
        await prisma.user.create({
            data: {
                email: SUPERUSER_EMAIL,
                password: hashedPassword,
                role: "superuser",
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
