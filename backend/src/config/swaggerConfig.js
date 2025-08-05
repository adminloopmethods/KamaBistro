// config/swaggerConfig.js
import path, {join, dirname} from "path";
import {fileURLToPath} from "url";
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadDoc(name) {
  // look in src/swaggerDocs instead of project root
  const filePath = path.join(__dirname, "../swaggerDocs", name + ".json");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Cannot find swagger doc: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const authDoc = loadDoc("auth");
const permDoc = loadDoc("permissions");
const roleDoc = loadDoc("roles");
const userDoc = loadDoc("users");
const notificationDoc = loadDoc("notifications");
const contentDoc = loadDoc("content");
const mediaDoc = loadDoc("media");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shade CMS APIs",
      version: "1.0.0",
      description:
        "This is an API Documentation of Content Management System (CMS) for Shade Corporation, designed to manage content on the Shade website. It features a role-based management system, user creation, and page content update capabilities. The system supports multiple roles, with a workflow that includes editing, verification, and publishing stages.",
      // termsOfService: "https://shadecms.com/terms",
      // contact: {
      //   name: "Shade CMS Team",
      //   email: "support@shadecms.com",
      //   url: "https://shadecms.com/support",
      // },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.BACKEND_PORT || 3000}`,
        description: "Local development server",
      },
      {
        url: "https://api.shadecms.com",
        description: "Production server",
      },
    ],
    paths: {
      ...authDoc.paths,
      ...permDoc.paths,
      ...roleDoc.paths,
      ...userDoc.paths,
      ...notificationDoc.paths,
      ...contentDoc.paths,
      ...mediaDoc.paths,
    },
    externalDocs: {
      description: "Full developer guide",
      url: "https://docs.shadecms.com",
    },
    tags: [
      {name: "Auth", description: "Authentication and session management"},
      {name: "Permissions", description: "Permissions for the roles"},
      {name: "Roles", description: "Role & permission endpoints"},
      {name: "Users", description: "User CRUD operations"},
      {
        name: "Notifications",
        description: "Real‑time and persisted notifications",
      },
      {name: "Content", description: "Content management endpoints"},
      {name: "Media", description: "File upload and media services"},
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT token in the format **Bearer &lt;token&gt;**",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: {type: "string"},
            code: {type: "integer", format: "int32"},
          },
          example: {
            message: "Invalid credentials",
            code: 401,
          },
        },
        User: {
          type: "object",
          properties: {
            id: {type: "string", format: "uuid"},
            email: {type: "string", format: "email"},
            name: {type: "string"},
            roles: {type: "array", items: {type: "string"}},
            createdAt: {type: "string", format: "date-time"},
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [join(__dirname, "../modules/**/*.js")],
};

// const token = loginResponse.token;

// ui.preauthorizeApiKey("BearerAuth", `Bearer ${token}`);

export default swaggerJSDoc(swaggerOptions);
