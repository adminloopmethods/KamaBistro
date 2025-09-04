import prismaClient from "../src/config/dbConfig.js";
import {EncryptData} from "../src/helper/bcryptManager.js";

const mode = process.env.MODE || "dev";
const email = process.env[`SUPER_ADMIN_EMAIL_${mode}`];
const pass = process.env[`SUPER_ADMIN_PASSWORD_${mode}`];

const roles = [{name: "EDITOR"}, {name: "VERIFIER"}];
const locations = [{name: "La Grange"}, {name: "Wicker Park"}, {name: "West Loop"}];

// Helper function to upsert roles
const upsertRole = async (role) => {
  await prismaClient.role.upsert({
    where: {name: role.name},
    update: {},
    create: {name: role.name},
  });
  console.log(`Ensured role: ${role.name}`);
};

// Helper fuction to upsert location
const upsertLocation = async (location) => {
  const existingLocation = await prismaClient.location.findFirst({
    where: {name: location.name},
  });

  if (!existingLocation) {
    await prismaClient.location.create({
      data: {name: location.name},
    });
    console.log(`Created location: ${location.name}`);
  } else {
    console.log(`Location already exists: ${location.name}`);
  }
};


const seedDB = async () => {
  try {
    // Upsert roles
    for (const role of roles) {
      await upsertRole(role);
    }

    // Upsert location
    for (const location of locations) {
      await upsertLocation(location);
    }

    // Hash the password
    const hashedPassword = await EncryptData(pass, 10);

    // Upsert super admin user
    await prismaClient.user.upsert({
      where: {email},
      update: {
        password: hashedPassword,
        isSuperUser: true,
      },
      create: {
        name: "SUPER ADMIN",
        email: email,
        password: hashedPassword,
        isSuperUser: true,
      },
    });
    console.log("Super admin user ensured successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
};

seedDB().catch((e) => {
  console.error(e);
  process.exit(1);
});

export default seedDB;
