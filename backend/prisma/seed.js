import prismaClient from "../src/config/dbConfig.js";
import { EncryptData } from "../src/helper/bcryptManager.js";


const email = process.env.SUPER_ADMIN_EMAIL;
const pass = process.env.SUPER_ADMIN_PASSWORD;

const roleTypes = [{ name: "USER" }, { name: "MANAGER" }];
const roles = [{ name: "SUPER_ADMIN" }];

const subPermissions = [
  { name: "CREATE", description: "Allows creation of new resources." },
  { name: "READ", description: "Allows read-only access to view resources." },
  {
    name: "EDIT/UPDATE",
    description: "Allows modification of existing resources.",
  },
  {
    name: "DISCARD",
    description: "Allows soft deletion or moving resources to trash.",
  },
  { name: "PUBLISH", description: "Allows publishing resources." },
  {
    name: "RESTORE",
    description: "Allows restoring a previous version of resources.",
  },
  {
    name: "EDIT_REQUEST",
    description: "Allows modification of verification requests.",
  },
  {
    name: "ARCHIVE",
    description: "Allows archiving resources without deleting them.",
  },
  {
    name: "ACTIVATE/DEACTIVATE",
    description: "Allows toggling resource status.",
  },
  {
    name: "APPROVE/REJECT",
    description: "Allows approving or rejecting resource changes.",
  },
  { name: "HOLD", description: "Allows pausing a request." },
];



const roleTypePermissionsMap = {
  USER: [
    {
      name: "EDIT",
      description:
        "User can edit the assigned resource and send it for verification.",
    },
    {
      name: "VERIFY",
      description:
        "User receives requests to verify resources submitted by editors and can approve/reject them.",
    },
    { name: "PUBLISH", description: "User can publish or reject content." },
  ],
  MANAGER: [
    {
      name: "PAGE_MANAGEMENT",
      description:
        "Manager can view all pages, assign roles, and perform all sub-permission actions.",
    },
    {
      name: "SERVICE_MANAGEMENT",
      description:
        "Manager can manage all services, assign roles, and handle updates.",
    },
    {
      name: "MARKET_MANAGEMENT",
      description:
        "Manager can manage all markets, assign roles, and handle updates.",
    },
    {
      name: "PROJECT_MANAGEMENT",
      description:
        "Manager can manage all projects, assign roles, and handle updates.",
    },
    {
      name: "NEWS_BLOGS_MANAGEMENT",
      description:
        "Manager can manage all news and blogs, assign roles, and handle updates.",
    },
    {
      name: "CAREER_MANAGEMENT",
      description:
        "Manager can manage careers, assign roles, and handle updates.",
    },
    {
      name: "ROLES_PERMISSION_MANAGEMENT",
      description: "Manager can assign and update roles and permissions.",
    },
    {
      name: "USER_MANAGEMENT",
      description: "Manager can manage all users and their roles.",
    },
    {
      name: "SINGLE_RESOURCE_MANAGEMENT",
      description:
        "Manager can assign users to single resources and oversee their updates.",
    },
    {
      name: "HEADER_MANAGEMENT",
      description: "Manager can modify header content and structure.",
    },
    {
      name: "FOOTER_MANAGEMENT",
      description: "Manager can modify footer content and structure.",
    },
    {
      name: "TESTIMONIAL_MANAGEMENT",
      description: "Manager can manage testimonials and user feedback.",
    },
    {
      name: "AUDIT_LOGS_MANAGEMENT",
      description: "Manager can review all system logs and track activities.",
    },
  ],
};

// Helper function to upsert role types
const upsertRoleType = async (roleType) => {
  await prismaClient.roleType.upsert({
    where: { name: roleType.name },
    update: {},
    create: roleType,
  });
  console.log(`Ensured role type: ${roleType.name}`);
};

// Helper function to upsert roles
const upsertRole = async (role) => {
  // Fetch the role type ID for "MANAGER"
  const managerRoleType = await prismaClient.roleType.findUnique({
    where: { name: "MANAGER" },
  });

  if (!managerRoleType) {
    console.error("Role type 'MANAGER' not found.");
    return;
  }

  await prismaClient.role.upsert({
    where: { name: role.name },
    update: {
      roleTypeId: managerRoleType.id, // Use the fetched roleTypeId
    },
    create: {
      name: role.name,
      roleTypeId: managerRoleType.id, // Use the fetched roleTypeId
    },
  });
  console.log(`Ensured role: ${role.name}`);
};


// Helper function to upsert sub-permissions
const upsertSubPermission = async (subPermission) => {
  await prismaClient.subPermission.upsert({
    where: { name: subPermission.name },
    update: { description: subPermission.description },
    create: subPermission,
  });
  console.log(`Ensured sub-permission: ${subPermission.name}`);
};

// Function to seed role type permissions
const seedRoleTypePermission = async (
  roleTypeName,
  permissionsList
) => {
  const roleType = await prismaClient.roleType.findUnique({
    where: { name: roleTypeName },
  });
  if (!roleType) {
    console.error(`RoleType not found: ${roleTypeName}`);
    return;
  }
  for (const permission of permissionsList) {
    await prismaClient.permission.upsert({
      where: { name: permission.name },
      update: {
        description: permission.description,
        roleTypeId: roleType.id,
      },
      create: {
        name: permission.name,
        description: permission.description,
        roleTypeId: roleType.id,
      },
    });
    console.log(
      `Ensured permission: ${permission.name} for role type: ${roleType.name}`
    );
  }
};

const seedDB = async () => {
  try {
    // Upsert role types
    for (const roleType of roleTypes) {
      await upsertRoleType(roleType);
    }

    // Upsert sub-permissions
    for (const subPermission of subPermissions) {
      await upsertSubPermission(subPermission);
    }

    // Create Permissions with role types
    for (const [roleTypeName, permissionsList] of Object.entries(
      roleTypePermissionsMap
    )) {
      await seedRoleTypePermission(
        roleTypeName,
        permissionsList
      );
    }

    // Fetch all permissions and sub-permissions
    const allPermissions = await prismaClient.permission.findMany();
    const allSubPermissions = await prismaClient.subPermission.findMany();

    // Create relationships between permissions and sub-permissions
    for (const selectivePermissions of roleTypePermissionsMap.MANAGER) {
      const permission = allPermissions.find(
        (perm) => perm.name === selectivePermissions.name
      );
      for (const subPermission of allSubPermissions) {
        await prismaClient.PermissionSubPermission.upsert({
          where: {
            permissionId_subPermissionId: {
              permissionId: permission.id,
              subPermissionId: subPermission.id,
            },
          },
          update: {},
          create: {
            permissionId: permission.id,
            subPermissionId: subPermission.id,
          },
        });
        console.log(
          `Ensured PermissionSubPermission for ${permission.name}: ${subPermission.name}`
        );
      }
    }

    // Upsert roles
    for (const role of roles) {
      await upsertRole(role);
    }

    const allRoles = await prismaClient.role.findMany();

    // Create relationships between roles and permissions
    for (const selectivePermissions of roleTypePermissionsMap.MANAGER) {
      const permission = allPermissions.find(
        (perm) => perm.name === selectivePermissions.name
      );
      for (const role of allRoles) {
        await prismaClient.RolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
        console.log(
          `Ensured RolePermission for ${role.name}: ${permission.name}`
        );
      }
    }

    // Hash the password
    const hashedPassword = await EncryptData(pass, 10);

    // Upsert super admin user
    await prismaClient.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        isSuperUser: true,
      },
      create: {
        name: "Super Admin",
        email: email,
        password: hashedPassword,
        isSuperUser: true,
        roles: {
          create: [{ role: { connect: { name: "SUPER_ADMIN" } } }],
        },
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
