import prismaClient from "../config/dbConfig.js";
import { EncryptData } from "../helper/bcryptManager.js";
import { addEmailJob } from "../helper/emailJobQueue.js";
import {
  userAccountCreationPayload,
  userAccountDeactivatedPayload,
  userAccountActivatedPayload,
} from "../other/EmailPayload.js";

const dashboardUrl = process.env.DASHBOARD_URL;
const supportEmail = process.env.SUPPORT_EMAIL;

/// USER QUERIES====================================================
// Create User
export const createUserHandler = async (
  name,
  email,
  password,
  phone,
  roles
) => {
  const existingUser = await prismaClient.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists. Please use a different email.");
  }

  const hashedPassword = await EncryptData(password, 10);
  const newUser = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      roles: {
        create:
          roles?.map((roleId) => ({
            role: {
              connect: { id: roleId },
            },
          })) || [],
      },
    },
    include: {
      roles: {
        include: { role: true },
      },
    },
  });

  // Use dynamic payload
  addEmailJob(userAccountCreationPayload({ name, email, password, dashboardUrl }));

  return newUser;
};

//Fetch all users
export const fetchAllUsers = async (
  name = "",
  email = "",
  phone = "",
  status = "",
  page = 1,
  limit = 1
) => {
  const skip = (page - 1) * limit;

  const allUsers = await prismaClient.user.findMany({
    where: {
      name: {
        not: "Super Admin",
        contains: name,
        mode: "insensitive",
      },
      email: email ? { contains: email, mode: "insensitive" } : undefined,
      phone: phone ? { contains: phone } : undefined,
      ...(status ? { status: status } : {}),
    },
    include: {
      roles: {
        include: {
          role: {
            // include: {
            //   permissions: {
            //     include: {
            //       permission: true,
            //     },
            //   },
            //   roleType: true,
            // },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
    skip,
    take: limit,
  });

  const totalUser = await prismaClient.user.count({
    where: {
      name: {
        not: "Super Admin",
        contains: name,
        mode: "insensitive",
      },
      email: email ? { contains: email, mode: "insensitive" } : undefined,
      phone: phone ? { contains: phone } : undefined,
      ...(status ? { status: status } : {}),
    },
  });

  return {
    allUsers,
    pagination: {
      totalUser,
      totalPages: Math.ceil(totalUser / limit),
      currentPage: page,
      limit,
    },
  };
};

// Update User
export const updateUser = async (id, name, password, phone, roles) => {
  const dataToUpdate = {
    name,
    phone,
    roles: {
      deleteMany: {},
      create:
        roles?.map((roleId) => ({
          role: { connect: { id: roleId } },
        })) || [],
    },
  };

  if (password) {
    // "changes for making password optional" at apr 7 11:32
    const hashedPassword = await EncryptData(password, 10);
    dataToUpdate.password = hashedPassword;
  }

  const updatedUser = await prismaClient.user.update({
    where: { id },
    data: dataToUpdate,
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
              roleType: true,
            },
          },
        },
      },
    },
  });

  const roleAndPermission =
    updatedUser.roles?.map((role) => ({
      id: role.role.id,
      role: role.role.name,
      roleType: role.role.roleType.name,
      status: role.role.status,
      permissions: role.role.permissions.map((perm) => perm.permission.name),
    })) || [];

  // Use dynamic payload
  // const emailPayload = userAccountUpdatePayload({ name: updatedUser.name, email: updatedUser.email });
  // addEmailJob(emailPayload);

  // Create a new object without the password field
  const userWithoutPassword = {
    ...updatedUser,
    roles: roleAndPermission,
  };
  delete userWithoutPassword.password;

  return userWithoutPassword;
};

export const getUserDetails = async (id) => {
  const user = await prismaClient.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
              roleType: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const roleAndPermission =
    user.roles?.map((role) => ({
      id: role.role.id,
      role: role.role.name,
      roleType: role.role.roleType.name,
      status: role.role.status,
      permissions: role.role.permissions.map((perm) => perm.permission.name),
    })) || [];

  // Create a new object without the password field
  const userWithoutPassword = {
    ...user,
    roles: roleAndPermission,
  };
  delete userWithoutPassword.password;
  return {result  : userWithoutPassword, msg: "updated through socket"};
};



export const updateProfile = async (id, name, phone, image) => {
  const updatedUser = await prismaClient.user.update({
    where: {id},
    data: {
      name,
      phone,
      image,
    },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
              roleType: true,
            },
          },
        },
      },
    },
  });
  const roleAndPermission =
    updatedUser.roles?.map((role) => ({
      id: role.role.id,
      role: role.role.name,
      roleType: role.role.roleType.name,
      status: role.role.status,
      permissions: role.role.permissions.map((perm) => perm.permission.name),
    })) || [];
  return {
    ...updatedUser,
    roles: roleAndPermission,
  };
};

export const fetchAllUsersByRoleId = async (roleId) => {
  const users = await prismaClient.user.findMany({
    where: {
      roles: {
        some: {
          roleId,
        },
      },
    },
    include: {
      roles: {
        include: {
          role: {
            include: {
              roleType: true,
              permissions: {
                select: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });
  // console.log(JSON.stringify(users), "users");
  const formattedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    isSuperUser: user.isSuperUser,
    phone: user.phone,
    status: user.status,
    roles: user.roles.map((role) => ({
      id: role.role.id,
      role: role.role.name,
      roleType: role.role.roleType.name,
      status: role.role.status,
      permissions: role.role.permissions.map(
        (permission) => permission.permission.name
      ),
    })),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
  return formattedUsers;
};

// Find and return the user object
export const findUserByEmail = async (email) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
              roleType: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return false; // Handle case where user is not found
  }

  // const roles = user.roles?.map((role) => role.role.name) || [];
  // const permissions =
  //   user.roles?.flatMap((role) =>
  //     role.role.permissions.map((permission) => permission.permission.name)
  //   ) || [];

  const roleAndPermission =
    user.roles?.map((role) => ({
      id: role.role.id,
      role: role.role.name,
      roleType: role.role.roleType.name,
      status: role.role.status,
      permissions: role.role.permissions.map((perm) => perm.permission.name),
    })) || [];
  // const roles = user.roles?.map((role) => role.role.name) || [];
  // const permissions =
  //   user.roles?.flatMap((role) =>
  //     role.role.permissions.map((permission) => permission.permission.name)
  //   ) || [];

  return {
    ...user,
    roles: roleAndPermission,
    // permissions,
  };
};

export const findUserById = async (id) => {
  const user = await prismaClient.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                select: {
                  permission: true,
                },
              },
              roleType: true,
            },
          },
        },
      },
      resourceRoles: {
        where: {
          status: "ACTIVE",
        },
        select: {
          role: true,
          userId: true,
          resource: {
            select: {
              titleEn: true,
              resourceType: true,
              resourceTag: true,
            },
          },
        },
      },
      resourceVerifiers: {
        where: {
          status: "ACTIVE",
        },
        select: {
          resource: {
            select: {
              titleEn: true,
              resourceType: true,
            },
          },
          userId: true,
          stage: true,
        },
      },
    },
  });

  return user;
};

// Update user password
export const updateUserPassword = async (userId, newPassword) => {
  return await prismaClient.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
};

/// OPT RELATED QUERIES====================================================

// Create or update the otp
export const createOrUpdateOTP = async (
  userId,
  deviceId,
  otpOrigin,
  otpCode,
  expiresAt
) => {
  return await prismaClient.otp.upsert({
    where: {
      userId_deviceId_otpOrigin: {
        userId,
        deviceId,
        otpOrigin,
      },
    },
    create: { userId, deviceId, otpOrigin, otpCode, expiresAt },
    update: { otpCode, expiresAt, isUsed: false },
  });
};

// find existing otp
export const findOTP = async (userId, deviceId, otpOrigin) => {
  return await prismaClient.otp.findFirst({
    where: { userId, deviceId, otpOrigin },
  });
};

// mark otp as used
export const markOTPUsed = async (otpId) => {
  return await prismaClient.otp.update({
    where: { id: otpId },
    data: { isUsed: true },
  });
};

// delete otp
export const deleteOTP = async (otpId) => {
  return await prismaClient.otp.delete({
    where: { id: otpId },
  });
};

/// RATE LIMITER RELATED QUERIES====================================================

// Find OTP attempts
export const findOtpAttempts = async (userId) => {
  return await prismaClient.rateLimit.findFirst({
    where: { userId },
  });
};

// Create OTP attempts
export const createOrUpdateOtpAttempts = async (userId) => {
  const now = new Date();

  return await prismaClient.rateLimit.upsert({
    where: { userId },
    update: {
      attempts: { increment: 1 },
      lastAttempt: now,
    },
    create: {
      userId,
      attempts: 0,
      failures: 0,
      lastAttempt: now,
      blockUntil: null,
    },
  });
};

// Block a user temporarily
export const blockUser = async (userId, blockUntil) => {
  return await prismaClient.rateLimit.update({
    where: { userId },
    data: { blockUntil },
  });
};

// Reset attempts after 24 hours (Cron Job)
export const resetOtpAttempts = async () => {
  const now = new Date();
  await prismaClient.rateLimit.updateMany({
    where: { blockUntil: { lte: now } },
    data: { attempts: 0, failures: 0, blockUntil: null },
  });
};

export const resetUserOtpAttempts = async () => {
  const now = new Date();

  // Find users whose last attempt was more than 24 hours ago but not blocked
  await prismaClient.rateLimit.updateMany({
    where: {
      blockUntil: null, // Only update users who are not blocked
      lastAttempt: {
        lte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 24 hours
      },
    },
    data: {
      attempts: 0, // Reset attempts
      failures: 0, // Reset failures
    },
  });

  // For users who are still blocked but need an updated block time:
  await prismaClient.rateLimit.updateMany({
    where: {
      blockUntil: {
        // Users who are blocked and should be updated
        lte: now,
      },
    },
    data: {
      attempts: 0, // Reset attempts after block period has ended
      failures: 0, // Reset failures
      blockUntil: null, // Clear block time after reset
    },
  });
};

export const userActivation = async (id) => {
  // Fetch user first to check current status
  const userBefore = await prismaClient.user.findUnique({
    where: { id },
  });

  if (!userBefore) return null;

  // Only proceed if user is not already active
  if (userBefore.status === "ACTIVE") {
    return userBefore;
  }

  const user = await prismaClient.user.update({
    where: {
      id: id,
    },
    data: {
      status: "ACTIVE",
    },
  });

  // Send activation email
  addEmailJob(userAccountActivatedPayload({ name: user.name, email: user.email, dashboardUrl }));

  return user;
};

export const userDeactivation = async (id) => {
  // Fetch user first to check current status
  const userBefore = await prismaClient.user.findUnique({
    where: { id },
  });

  if (!userBefore) return null;

  // Only proceed if user is not already inactive
  if (userBefore.status === "INACTIVE") {
    return userBefore;
  }

  const user = await prismaClient.user.update({
    where: {
      id: id,
    },
    data: {
      status: "INACTIVE",
    },
  });

  // Send deactivation email
  addEmailJob(userAccountDeactivatedPayload({ name: user.name, email: user.email, supportEmail }));

  return user;
};

export const findRoleTypeByUserId = async (id) => {
  const roleType = await prismaClient.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          role: {
            include: {
              roleType: true,
            },
          },
        },
      },
    },
  });

  return roleType;
};

export const fetchAllRolesForUser = async () => {
  const roles = await prismaClient.role.findMany({
    where: {
      name: {
        not: "SUPER_ADMIN", // Exclude SUPER_ADMIN
      },
    },
    include: {
      _count: {
        select: {
          permissions: true, // Count of permissions per role
          users: true, // Count of users per role
        },
      },
    },
    orderBy: { created_at: "asc" },
  });

  return {
    roles,
  };
};

export const findAllLogs = async (search, status, pageNum, limitNum, entity, startDate, endDate) => {
  const skip = (pageNum - 1) * limitNum;

  // Helper function to create date range that includes the entire end date
  const createDateRange = (start, end) => {
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    
    // Set start date to beginning of day (00:00:00.000)
    startDateTime.setHours(0, 0, 0, 0);
    
    // Set end date to end of day (23:59:59.999)
    endDateTime.setHours(23, 59, 59, 999);
    
    console.log('Date Range Debug:', {
      originalStart: start,
      originalEnd: end,
      adjustedStart: startDateTime.toISOString(),
      adjustedEnd: endDateTime.toISOString()
    });
    
    return {
      gte: startDateTime,
      lte: endDateTime,
    };
  };

  // Define the where clause for both findMany and count
  const whereClause = {
    action_performed: {
      contains: search,
      mode: "insensitive",
    },
    ...(status ? { outcome: status } : {}),
    ...(entity ? { entity } : {}),
    ...(startDate && endDate
      ? {
          timestamp: createDateRange(startDate, endDate),
        }
      : {}),
  };

  const [logs, totalLogs] = await Promise.all([
    prismaClient.auditLog.findMany({
      where: whereClause,
      include: {
        user: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      skip,
      take: limitNum,
    }),
    prismaClient.auditLog.count({
      where: whereClause,
    }),
  ]);

  return {
    logs,
    pagination: {
      totalLogs,
      totalPages: Math.ceil(totalLogs / limitNum),
      currentPage: pageNum,
      limitNum,
    },
  };
};

export const updateProfileImage = async (userId, imageUrl) => {
  const profileImage = await prismaClient.user.update({
    where: {id: userId},
    data: {image: imageUrl},
  });

  return profileImage;
};

export const deleteLogsByDateRange = async (startDate, endDate) => {
  if (!startDate || !endDate) throw new Error('Both startDate and endDate are required');
  
  // Helper function to create date range that includes the entire end date
  const createDateRange = (start, end) => {
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    
    // Set start date to beginning of day (00:00:00.000)
    startDateTime.setHours(0, 0, 0, 0);
    
    // Set end date to end of day (23:59:59.999)
    endDateTime.setHours(23, 59, 59, 999);
    
    console.log('Delete Date Range Debug:', {
      originalStart: start,
      originalEnd: end,
      adjustedStart: startDateTime.toISOString(),
      adjustedEnd: endDateTime.toISOString()
    });
    
    return {
      gte: startDateTime,
      lte: endDateTime,
    };
  };

  const result = await prismaClient.auditLog.deleteMany({
    where: {
      timestamp: createDateRange(startDate, endDate),
    },
  });
  return result.count;
};
