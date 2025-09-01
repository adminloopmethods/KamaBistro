// Import dependencies
import { randomUUID } from "node:crypto";   // ✅ import randomUUID directly
import { createWebpageService } from "../src/modules/content/content.service.js";
// import OurGroup from "./templates/privateDinning.json" assert { type: "json" };
import OurGroup from "../test.json"  assert { type: "json" };

// Function to recursively replace all "id" fields with new UUIDs
function replaceIds(obj) {
  if (Array.isArray(obj)) {
    return obj.map(replaceIds);
  } else if (typeof obj === "object" && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      if (key === "id") {
        newObj[key] = randomUUID();   // ✅ always generate a new UUID
      } else {
        newObj[key] = replaceIds(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

// Replace IDs in your JSON data
const newData = replaceIds(OurGroup);

// Optionally refresh timestamps too
newData.createdAt = new Date().toISOString();
newData.updatedAt = new Date().toISOString();

// console.log(newData);

// Save to database
async function readData() {
  await createWebpageService(newData);
}

readData();
