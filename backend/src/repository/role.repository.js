import prismaClient from "../config/dbConfig.js";

export const findRoles = async (searchTerm = "", status = "", page, limit) => {
  const skip = (page - 1) * limit;
  const roles = await prismaClient.role.findMany({
    where: {
      name: {
        not: "SUPER_ADMIN", // Exclude SUPER_ADMIN
        contains: searchTerm,
        mode: "insensitive",
      },
      ...(status ? { status: status } : {}),
    },
    include: {
      _count: {
        select: {
          permissions: true, // Count of permissions per role
          users: true, // Count of users per role
        },
      },
      // permissions: {
      //   include: {
      //     permission: {
      //       select: {
      //         _count: {
      //           select: {
      //             permissionSubPermission: true, // Count of subpermissions per permission
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    },
    orderBy: { created_at: "asc" },
    skip,
    take: limit,
  });

  const totalRoles = await prismaClient.role.count({
    where: {
      name: {
        not: "SUPER_ADMIN",
        contains: searchTerm,
        mode: "insensitive",
      },
      ...(status ? { status: status } : {}),
    },
  });

  return {
    roles,
    pagination: {
      totalRoles,
      totalPages: Math.ceil(totalRoles / limit),
      currentPage: page,
      limit,
    },
  };
};

export const findRoleById = async (id) => {
  const role = await prismaClient.role.findUnique({
    where: {
      id: id,
    },
    include: {
      permissions: {
        include: {
          permission: {
            include: {
              subPermissions: {
                select: {
                  subPermission: true,
                },
              },
            },
          },
        },
      },
      roleType: true,
      users: {
        select: {
          user: true,
        },
      },
    },
  });
  // Check if the role is "SUPER_ADMIN"
  if (role && role.name === "SUPER_ADMIN") return null; // Return null if the role is "SUPER_ADMIN"
  return role; // Otherwise, return the role
};

export const findRoleType = async () => {
  return await prismaClient.roleType.findMany({
    where: {},
  });
};

export const createNewRoles = async (name, roleTypeId, permissionsArray) => {

  // Check for duplicate role name
  const existingRole = await prismaClient.role.findUnique({
    where: { name },
  });
  if (existingRole) {
    throw new Error("A role with this name already exists.");
  }

  const roles = await prismaClient.role.create({
    data: {
      name,
      roleTypeId,
      permissions: {
        // Ensure relation name is correct
        create: permissionsArray.map((permissionId) => ({
          permissionId: permissionId,
        })),
      },
    },
    // include: {permissions: true},
  });

  if (!roles) return false; // for handling the assert through false

  return { roles };
};

export const updateRoleById = async (id, name, roleTypeId, permissions) => {
  const role = await prismaClient.role.update({
    where: { id },
    data: {
      name: name,
      roleTypeId,
      permissions: {
        deleteMany: {},
        create: permissions.map((permissionId) => ({
          permissionId: permissionId,
        })),
      },
    },
  });
  if (!role) return false; // for handling the assert through false
  return { role };
};

export const roleActivation = async (id) => {
  const role = await prismaClient.role.update({
    where: {
      id: id,
    },
    data: {
      status: "ACTIVE",
    },
  });

  return role;
};

export const roleDeactivation = async (id) => {
  const role = await prismaClient.role.update({
    where: {
      id: id,
    },
    data: {
      status: "INACTIVE",
    },
  });

  return role;
};

// export const updateRoleinDB = async (id, updateObj) => {
//   // confirming the for the role to exist
//   const confirmRole = await findRoleById(id);

//   if (!confirmRole) return false;

//   console.log(updateObj);
//   const role = prismaClient.role.update({
//     where: {id: id},
//     data: updateObj,
//   });

//   return role;
// };
