import prismaClient from "../config/dbConfig.js";
import {createNotification} from "../repository/notification.repository.js";

export const handleEntityCreationNotification = async ({
  io,
  userId, // performer (actor)
  entity,
  newValue,
  actionType,
  targetUserId = null, // for user update/assignment
  resource = null, // for resource actions
  actionDetails = {}, // e.g., { assignmentRole, actionType, requestType, etc. }
}) => {
  try {
    const creator = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { roles: { select: { roleId: true } } },
    });
    if (!creator) {
      console.warn("creator not found: ", userId);
      return;
    }
    const subject = newValue?.name || newValue?.email || newValue?.title || newValue?.id;
    const verb = actionType === "CREATE" ? "created" : actionType === "UPDATE" ? "updated" : actionType?.toLowerCase();
    const actorLabel = creator.isSuperUser ? "Super Admin" : `User '${creator.name}'`;
    let eventName = `${entity}_${verb}`;
    // --- Build recipient list with context ---
    let recipients = [];
    // Always include all super admins (with context)
    const superAdmins = await prismaClient.user.findMany({ where: { isSuperUser: true } });
    superAdmins.forEach((u) => recipients.push({ user: u, context: "superadmin" }));
    if (entity === "role") {
      // Only users with ROLE_MANAGEMENT permission
      const roleMgmtPerm = await prismaClient.permission.findUnique({ where: { name: "ROLES_PERMISSION_MANAGEMENT" } });
      if (roleMgmtPerm) {
        const permUsers = await prismaClient.user.findMany({
          where: {
            roles: {
              some: {
                role: {
                  permissions: { some: { permissionId: roleMgmtPerm.id } },
                },
              },
            },
          },
        });
        permUsers.forEach((u) => recipients.push({ user: u, context: "rolemanager" }));
      }
    } else if (entity === "user") {
      // Only users with USER_MANAGEMENT permission
      const userMgmtPerm = await prismaClient.permission.findUnique({ where: { name: "USER_MANAGEMENT" } });
      if (userMgmtPerm) {
        const permUsers = await prismaClient.user.findMany({
          where: {
            roles: {
              some: {
                role: {
                  permissions: { some: { permissionId: userMgmtPerm.id } },
                },
              },
            },
          },
        });
        permUsers.forEach((u) => recipients.push({ user: u, context: "usermanager" }));
      }
      // The target user (if updated)
      if (targetUserId && targetUserId !== userId) {
        const targetUser = await prismaClient.user.findUnique({ where: { id: targetUserId } });
        if (targetUser) recipients.push({ user: targetUser, context: "targetuser" });
      }
    } else if (entity === "resource") {
      // Content module: management permissions (excluding role/user/logs management)
      // Define allowed management permissions for content
      const contentManagementPermissions = [
        "PAGE_MANAGEMENT", "MARKET_MANAGEMENT", "SERVICE_MANAGEMENT", "PROJECT_MANAGEMENT", "NEWS_MANAGEMENT", "SAFETY_MANAGEMENT", "CAREER_MANAGEMENT", "TESTIMONIAL_MANAGEMENT", "FOOTER_MANAGEMENT", "HEADER_MANAGEMENT", "AFFILIATE_MANAGEMENT", "HSE_MANAGEMENT", "ORGANIZATIONAL_CHART_MANAGEMENT"
      ];
      // Get all users with any of these permissions
      const contentPerms = await prismaClient.permission.findMany({ where: { name: { in: contentManagementPermissions } } });
      const contentPermIds = contentPerms.map((p) => p.id);
      if (contentPermIds.length) {
        const permUsers = await prismaClient.user.findMany({
          where: {
            roles: {
              some: {
                role: {
                  permissions: { some: { permissionId: { in: contentPermIds } } },
                },
              },
            },
          },
        });
        permUsers.forEach((u) => recipients.push({ user: u, context: "contentmanager" }));
      }
      // Add users associated with the resource (editor, manager, verifier, publisher)
      if (resource?.id) {
        const resourceRoles = await prismaClient.resourceRole.findMany({
          where: { resourceId: resource.id, status: "ACTIVE" },
          include: { user: true },
      });
        resourceRoles.forEach((r) => recipients.push({ user: r.user, context: r.role.toLowerCase() }));
        const verifiers = await prismaClient.resourceVerifier.findMany({
          where: { resourceId: resource.id, status: "ACTIVE" },
          include: { user: true },
        });
        verifiers.forEach((v) => recipients.push({ user: v.user, context: `verifier_stage_${v.stage}` }));
      }
    }

    // Remove duplicates (by user id)
    const uniqueRecipients = new Map();
    recipients.forEach(({ user, context }) => {
      if (user && user.id && user.id !== userId) {
        if (!uniqueRecipients.has(user.id)) uniqueRecipients.set(user.id, { user, contexts: [context] });
        else uniqueRecipients.get(user.id).contexts.push(context);
      }
    });
    // --- Send custom message to each recipient ---
    for (const { user, contexts } of uniqueRecipients.values()) {
      let customMessage = "";
      // Super admin always gets a generic message
      if (user.isSuperUser) {
        customMessage = `${actorLabel} ${verb} the ${entity} '${subject}'`;
      } else if (entity === "role" && contexts.includes("rolemanager")) {
        customMessage = `${actorLabel} ${verb} a role '${subject}'`;
      } else if (entity === "user") {
        if (contexts.includes("targetuser")) {
          customMessage = `${actorLabel} has updated your profile.`;
        } else if (contexts.includes("usermanager")) {
          customMessage = `${actorLabel} ${verb} the user '${subject}'`;
        }
      } else if (entity === "resource") {
        // Assignment/flow roles take priority over contentmanager
        if (contexts.includes("manager")) {
          customMessage = `${actorLabel} ${verb} a resource you manage: '${resource?.titleEn || resource?.titleAr || resource?.id}'`;
        } else if (contexts.includes("editor")) {
          customMessage = `${actorLabel} ${verb} a resource you edit: '${resource?.titleEn || resource?.titleAr || resource?.id}'`;
        } else if (contexts.some((c) => c.startsWith("verifier_stage_"))) {
          customMessage = `${actorLabel} ${verb} a resource you verify: '${resource?.titleEn || resource?.titleAr || resource?.id}'`;
        } else if (contexts.includes("publisher")) {
          customMessage = `${actorLabel} ${verb} a resource you publish: '${resource?.titleEn || resource?.titleAr || resource?.id}'`;
        } else if (contexts.includes("contentmanager") && actionType !== "ASSIGN" && !(contexts.includes("manager") || contexts.includes("editor") || contexts.some((c) => c.startsWith("verifier_stage_")) || contexts.includes("publisher"))) {
          // Only send contentmanager if not assigned as manager/editor/verifier/publisher and not for ASSIGN
          customMessage = `${actorLabel} ${verb} a resource in your management area: '${resource?.titleEn || resource?.titleAr || resource?.id}'`;
        }
      }
      // Fallback
      if (!customMessage) {
        customMessage = `${actorLabel} ${verb} the ${entity} '${subject}'`;
      }
      // io.to(user.id).emit(eventName, {
      //   userId: user.id,
      //   message: customMessage,
      // });
      await createNotification({ userId: user.id, message: customMessage });
    }
  } catch (error) {
    console.error("Error in handleEntityCreationNotification:", error);
  }
};

// import prismaClient from "../config/dbConfig.js";
// import {createNotification} from "../repository/notification.repository.js";

// export const handleEntityCreationNotification = async ({
//   io,
//   userId,
//   entity,
//   newValue,
// }) => {
//   try {
//     const creator = await prismaClient.user.findUnique({
//       where: {id: userId},
//       include: {roles: {select: {roleId: true}}},
//     });

//     if (!creator) {
//       console.warn("creator not found: ", userId);
//       return;
//     }

//     let recipients = [];

//     let message = `A new ${entity} '${
//       newValue.name || newValue.email || newValue.title || newValue.id
//     }' has been created`;

//     switch (entity) {
//       case "role": {
//         // Step 1: Get creator's permission IDs
//         const creatorPermissions = await prismaClient.rolePermission.findMany({
//           where: {
//             roleId: {
//               in: creator.roles.map((r) => r.roleId),
//             },
//           },
//           select: {permissionId: true},
//         });

//         const permissionIds = creatorPermissions.map((p) => p.permissionId);

//         if (permissionIds.length === 0) return;

//         // Step 2: Find users who have any of these permissions (excluding creator)
//         const matchingUsers = await prismaClient.user.findMany({
//           where: {
//             id: {not: creator.id},
//             roles: {
//               some: {
//                 role: {
//                   permissions: {
//                     some: {
//                       permissionId: {in: permissionIds},
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         });

//         // Step 3: Recipients are those matching users
//         recipients = matchingUsers;
//         break;
//       }

//       case "user": {
//         const creatorRoleIds = creator.roles.map((r) => r.roleId);
//         recipients = await prismaClient.user.findMany({
//           where: {
//             id: {not: creator.id},
//             roles: {
//               some: {
//                 roleId: {in: creatorRoleIds},
//               },
//             },
//           },
//         });
//         break;
//       }

//       default: {
//         // General case: just notify the super admins or the creator themselves
//         recipients = await prismaClient.user.findMany({
//           where: {
//             OR: [
//               {isSuperUser: true},
//               {id: userId}, // Creator always receives
//             ],
//           },
//         });
//         break;
//       }
//     }

//     const eventName = `${entity}_created`;

//     for (const recipient of recipients) {
//       io.emit(eventName, {
//         userId: recipient.id,
//         message,
//       });

//       await createNotification({
//         userId: recipient.id,
//         message,
//       });
//     }
//   } catch (error) {
//     console.error("Error in handleEntityCreationNotification:", error);
//   }
// };
