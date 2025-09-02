// Import dependencies
import { randomUUID } from "node:crypto";
import { createWebpageService } from "../src/modules/content/content.service.js";

// import OurGroup from "./templates/privateDinning.json" assert { type: "json" };
import OurGroup from "./templates/ourGroup.json"  assert { type: "json" };



// Import multiple JSON objects
import OurGroup from "../test.json" assert { type: "json" };
import PrivateDining from "./templates/privateDinning.json" assert { type: "json" };
import cateringPage from "./templates/catering.json" assert { type: "json" };
import ourCulture from "./templates/ourCulture.json" assert { type: "json" };
import contactUS from "./templates/contactUs.json" assert { type: "json" };


// Put them in an array
const webpages = [OurGroup, PrivateDining, cateringPage, ourCulture, contactUS];

// Function to recursively replace all "id" fields with new UUIDs
function replaceIds(obj) {
  if (Array.isArray(obj)) {
    return obj.map(replaceIds);
  } else if (typeof obj === "object" && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      if (key === "id") {
        newObj[key] = randomUUID();
      } else {
        newObj[key] = replaceIds(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

// Main function to process all webpages
async function processWebpages() {
  for (const page of webpages) {
    const newData = replaceIds(page);

    // Refresh timestamps
    newData.createdAt = new Date().toISOString();
    newData.updatedAt = new Date().toISOString();

    // Save to database
    await createWebpageService(newData);
  }
}

processWebpages();