const softDeleteMiddleware = async (params, next) => {
  if (params.model === "User") {
    // For findUnique/findFirst operations
    if (params.action === "findUnique" || params.action === "findFirst") {
      // Check if this is a query by ID (which should include soft-deleted users)
      const isQueryById = params.args.where && params.args.where.id;

      // Only add deletedAt filter if not querying by ID
      if (!isQueryById) {
        params.action = "findFirst";
        if (!params.args.where) params.args.where = {};
        params.args.where["deletedAt"] = null;
      }
    }

    // For findMany operations
    if (params.action === "findMany") {
      if (!params.args.where) {
        params.args.where = {};
      }
      params.args.where["deletedAt"] = null;
    }

    // For update queries - FIXED CONDITION
    if (params.action === "update") {
      // Check if this is a restore operation (setting deletedAt to null)
      const isRestoreOperation = params.args.data?.deletedAt === null;

      if (!isRestoreOperation) {
        // For regular updates, prevent updating soft-deleted records
        // We need to ensure we're not modifying the action type incorrectly
        if (!params.args.where) params.args.where = {};
        params.args.where["deletedAt"] = null;
      }
      // If it's a restore operation, let it proceed as a normal update
    }

    // For delete queries, change to update and set deletedAt
    if (params.action === "delete") {
      params.action = "update";
      params.args.data = {deletedAt: new Date()};
    }

    // For deleteMany queries, change to updateMany
    if (params.action === "deleteMany") {
      params.action = "updateMany";
      if (!params.args.data) {
        params.args.data = {};
      }
      params.args.data["deletedAt"] = new Date();
    }
  }
  return next(params);
};

export default softDeleteMiddleware;
