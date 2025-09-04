// Import dependencies
import { randomUUID } from "node:crypto";
import { createWebpageService } from "../src/modules/content/content.service.js";

import Catering from "./templates/catering.json" assert {type: "json"}
import CateringLocationOne from "./templates/cateringLocationone.json" assert {type: "json"}
import CateringLocationTwo from "./templates/cateringLocationtwo.json" assert {type: "json"}
import CateringLocationThree from "./templates/cateringLocationthree.json" assert {type: "json"}
import ContactUs from "./templates/contactUs.json" assert {type: "json"}
import LandingPageLocationOne from "./templates/landingPageLocationone.json" assert {type: "json"}
import LandingPageLocationTwo from "./templates/landingPageLocationtwo.json" assert {type: "json"}
import LandingPageLocationThree from "./templates/landingPageLocationthree.json" assert {type: "json"}
import orderOnlineLocationOne from "./templates/orderOnlineLocationone.json" assert {type: "json"}
import orderOnlineLocationTwo from "./templates/orderOnlineLocationtwo.json" assert {type: "json"}
import orderOnlineLocationThree from "./templates/orderOnlineLocationthree.json" assert {type: "json"}
import ourCulture from "./templates/ourCulture.json" assert {type: "json"}
import ourGroup from "./templates/ourGroup.json" assert {type: "json"}
import privateDinning from "./templates/privateDinning.json" assert {type: "json"}
import privateDinningLocationOne from "./templates/privateDinningLocationone.json" assert {type: "json"}
import privateDinningLocationTwo from "./templates/privateDinningLocationtwo.json" assert {type: "json"}
import privateDinningLocationThree from "./templates/privateDinningLocationthree.json" assert {type: "json"}
import reserveTableLocationOne from "./templates/reserveTableLocationone.json" assert {type: "json"}
import reserveTableLocationTwo from "./templates/reserveTableLocationtwo.json" assert {type: "json"}
import reserveTableLocationThree from "./templates/reserveTableLocationthree.json" assert {type: "json"}
// import Catering from "./templates/catering.json" assert {type: "json"}
// import Catering from "./templates/catering.json" assert {type: "json"}


// Put them in an array
const webpages = [
  // Catering,
  CateringLocationOne,
  CateringLocationTwo,
  CateringLocationThree,
  ContactUs,
  LandingPageLocationOne,
  LandingPageLocationTwo,
  LandingPageLocationThree,
  orderOnlineLocationOne,
  orderOnlineLocationTwo,
  orderOnlineLocationThree,
  ourCulture,
  ourGroup,
  privateDinning,
  privateDinningLocationOne,
  privateDinningLocationTwo,
  privateDinningLocationThree,
  reserveTableLocationOne,
  reserveTableLocationTwo,
  reserveTableLocationThree
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

processWebpages();