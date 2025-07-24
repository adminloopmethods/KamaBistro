// prisma/seed.js
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SUPERUSER_EMAIL
  const password = process.env.SUPERUSER_PASSWORD

  if (!email || !password) {
    throw new Error("SUPERUSER_EMAIL and SUPERUSER_PASSWORD must be defined in .env")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log('Superuser already exists:', existingUser.email)
    return
  }

  const superUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'admin'
    }
  })

  console.log('Superuser created:', superUser.email)
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
