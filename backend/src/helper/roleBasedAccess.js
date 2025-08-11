import prismaClient from "../config/dbConfig.js";
import {logger} from "../config/logConfig.js";
import {assert} from "../errors/assertError.js";
import statusCodes from "../errors/statusCodes.js";

export const checkPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id; // Assume JWT decoded user ID
      const user = await prismaClient.user.findUnique({
        where: {id: userId},
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
                },
              },
            },
          },
        },
      });

      // console.log(user, "userfound");

      assert(user, "NOT_FOUND", statusCodes.NOT_FOUND.message);

      const userPermissions = user.roles.flatMap((role) =>
        role.role.permissions.map((p) => p.permission.name)
      );

      // console.log(userPermissions, "userPermissions");

      const hasPermission = requiredPermissions.every((p) =>
        userPermissions.includes(p)
      );

      // console.log(hasPermission, "hasPermission");

      assert(hasPermission, "FORBIDDEN", statusCodes.FORBIDDEN.message);

      // console.log(true, "checkpassed");

      logger.info(`User ${userId} accessed API successfully`, {
        userId,
        requiredPermissions,
      });

      next();
    } catch (error) {
      logger.error(
        `Permission check failed for user ${req.user?.id || "Unknown"}`,
        {
          error: error.message,
          requiredPermissions,
        }
      );
      next(error);
    }
  };
};
