// Import dependencies
import { randomUUID } from "node:crypto";
import { createWebpageService } from "../src/modules/content/content.service.js";
import prismaClient from "../src/config/dbConfig.js";
// import pages
import home from "./templatesBase/Home.json" assert {type: "json"}
import OurGroup from "./templatesBase/OurGroup.json" assert {type: "json"}
import OurCulture from "./templatesBase/OurCulture.json" assert {type: "json"}
import PrivateDinning from "./templatesBase/PrivateDinning.json" assert {type: "json"}
import Catering from "./templatesBase/Catering.json" assert {type: "json"}
import ContactUs from "./templatesBase/Contact-us.json" assert { type: "json" }

// import pages for location 1
import homeLanding from "./templateLocationPage/HomeLanding.json" assert {type: "json"}
import orderOnline from "./templateLocationPage/OrderOnline.json" assert {type: "json"}
import privateDinning from "./templateLocationPage/PrivateDinning.json" assert {type: "json"}
import landingCatering from "./templateLocationPage/LandingCatering.json" assert {type: "json"}
import reserveTable from "./templateLocationPage/ReserveTable.json" assert {type: "json"}
import menu from "./templateLocationPage/Menu.json" assert {type: "json"}

// import pages for location 2
import homeLandingTwo from "./templateLocationPage2/HomeLanding.json" assert {type: "json"}
import orderOnlineTwo from "./templateLocationPage2/OrderOnline.json" assert {type: "json"}
import privateDinningTwo from "./templateLocationPage2/PrivateDinning.json" assert {type: "json"}
import landingCateringTwo from "./templateLocationPage2/LandingCatering.json" assert {type: "json"}
import reserveTableTwo from "./templateLocationPage2/ReserveTable.json" assert {type: "json"}
import menuTwo from "./templateLocationPage2/Menu.json" assert {type: "json"}

// import pages for location 3
import homeLandingThree from "./templateLocationPage3/HomeLanding.json" assert {type: "json"}
import orderOnlineThree from "./templateLocationPage3/OrderOnline.json" assert {type: "json"}
import privateDinningThree from "./templateLocationPage3/PrivateDinning.json" assert {type: "json"}
import landingCateringThree from "./templateLocationPage3/LandingCatering.json" assert {type: "json"}
import reserveTableThree from "./templateLocationPage3/ReserveTable.json" assert {type: "json"}
import menuThree from "./templateLocationPage3/Menu.json" assert {type: "json"}

// Put them in an array
const webpages = [
  // bases
  home,
  OurGroup,
  OurCulture,
  PrivateDinning,
  Catering,
  ContactUs,

  // location 1 pages
  homeLanding,
  orderOnline,
  privateDinning,
  landingCatering,
  reserveTable,
  menu,

  // location 2 pages
  homeLandingTwo,
  orderOnlineTwo,
  privateDinningTwo,
  landingCateringTwo,
  reserveTableTwo,
  menuTwo,

  // location 3 pages
  homeLandingThree,
  orderOnlineThree,
  privateDinningThree,
  landingCateringThree,
  reserveTableThree,
  menuThree
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


async function getLocationId(locationName) {
  if (!locationName) return null
  const location = await prismaClient.location.findFirst({
    where: { name: locationName }
  });
  return location?.id; // ← matches your schema (`id` is PK, not `locationId`)
}

// Main function to process all webpages
async function processWebpages() {
  for (const page of webpages) {

    const newData = replaceIds(page);

    const locationID = await getLocationId(page.locationName)
    newData.locationId = locationID

    // Refresh timestamps
    newData.createdAt = new Date().toISOString();
    newData.updatedAt = new Date().toISOString();

    // Save to database
    await createWebpageService(newData);
  }
}

processWebpages().then(() => console.log("Pages created successfully"));