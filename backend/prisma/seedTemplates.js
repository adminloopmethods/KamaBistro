// Import dependencies
import { randomUUID } from "node:crypto";
import { createWebpageService } from "../src/modules/content/content.service.js";

// import pages
import home from "./templatesBase/Home.json" assert {type: "json"}
import OurGroup from "./templatesBase/OurGroup.json" assert {type: "json"}
import OurCulture from "./templatesBase/OurCulture.json" assert {type: "json"}
import PrivateDinning from "./templatesBase/PrivateDinning.json" assert {type: "json"}
import Catering from "./templatesBase/Catering.json" assert {type: "json"}
import ContactUs from "./templatesBase/Contact-us.json" assert { type: "json" }
// import pages for landing
import homeLanding from "./templateLandingPage/HomeLanding.json" assert {type: "json"}
import orderOnline from "./templateLandingPage/OrderOnline.json" assert {type: "json"}
import privateDinning from "./templateLandingPage/PrivateDinning.json" assert {type: "json"}
import landingCatering from "./templateCateringPage/LandingCatering.json" assert {type: "json"}
import reserveTable from "./templateReserveTablePage/ReserveTable.json" assert {type: "json"}


// Put them in an array
const webpages = [
  // bases
  // home,
  // OurGroup,
  // OurCulture,
  // PrivateDinning,
  // Catering,
  // ContactUs,

  // landing pages
  // homeLanding,
  // orderOnline,
  // privateDinning,
  // landingCatering,
  // reserveTable
]

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

processWebpages().then(() => console.log("Pages created successfully"));