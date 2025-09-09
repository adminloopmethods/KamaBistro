// import {PrismaClient} from "@prisma/client";
// import AppError from "../errors/AppError.js";
// import softDeleteMiddleware from "../helper/softDeleteMiddleware.js";

// const isProduction = process.env.MODE === "production";

// const prismaClient = new PrismaClient({
//   // log: isProduction ? ["warn", "error"] : ["query", "info", "warn", "error"],
//   // log: isProduction ? ["warn", "error"] : ["query", "info", "warn", "error"],
// }).$extends({
//   query: {
//     $allModels: {
//       async $allOperations({model, operation, args, query}) {
//         try {
//           const result = await query(args);
//           return result;
//         } catch (error) {
//           // Log the error
//           console.error("Prisma Error:", error);
//           throw new AppError(
//             "DATABASE_ERROR",
//             "Database operation failed",
//             error
//           );
//         }
//       },
//     },
//   },
// });

// const connectDB = async () => {
//   try {
//     await prismaClient.$connect();
//     const databaseUrl = process.env.DATABASE_URL;
//     const dbName = databaseUrl.split("/").pop().split("?")[0];

//     console.log(`Database connected successfully to ${dbName}`);
//   } catch (error) {
//     console.error("Error connecting to the database:", error.message);
//     process.exit(1);
//   }
// };

// connectDB();

// export default prismaClient;

import {PrismaClient} from "@prisma/client";
import AppError from "../errors/AppError.js";
import softDeleteMiddleware from "../helper/softDeleteMiddleware.js";

const isProduction = process.env.MODE === "production";

// Create the base Prisma client
const basePrismaClient = new PrismaClient({
  // log: isProduction ? ["warn", "error"] : ["query", "info", "warn", "error"],
});

// Add the soft delete middleware FIRST
basePrismaClient.$use(softDeleteMiddleware);

// THEN extend the client and assign to prismaClient
const prismaClient = basePrismaClient.$extends({
  query: {
    $allModels: {
      async $allOperations({model, operation, args, query}) {
        try {
          const result = await query(args);
          return result;
        } catch (error) {
          // Log the error
          console.error("Prisma Error:", error);
          throw new AppError(
            "DATABASE_ERROR",
            "Database operation failed",
            error
          );
        }
      },
    },
  },
});

const connectDB = async () => {
  try {
    await prismaClient.$connect();
    const databaseUrl = process.env.DATABASE_URL;
    const dbName = databaseUrl.split("/").pop().split("?")[0];

    console.log(`Database connected successfully to ${dbName}`);
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};

connectDB();

// Export the extended client with the same name
export default prismaClient;
