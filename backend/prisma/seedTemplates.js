// Import dependencies
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
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
  home,
  OurGroup,
  OurCulture,
  PrivateDinning,
  Catering,
  ContactUs,

  // landing pages
  homeLanding,
  orderOnline,
  privateDinning,
  landingCatering,
  reserveTable
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

// Main function to process all webpages in a transaction
export async function processWebpages() {
  const prisma = new PrismaClient();

  // Prepare all new data first
  const newPages = webpages.map(page => {
    const newData = replaceIds(page);
    newData.createdAt = new Date().toISOString();
    newData.updatedAt = new Date().toISOString();
    return newData;
  });

  try {
    await prisma.$transaction(async (tx) => {
      // We assume createWebpageService can accept a Prisma transaction client as an optional argument
      // If not, you may need to refactor createWebpageService to accept tx or use tx directly here
      for (const newData of newPages) {
        try {
          await createWebpageService(newData, tx);
          console.log(`Inserted page with route: ${newData.route}`);
        } catch (error) {
          // Prisma error code for unique constraint violation is P2002
          if (error.code === 'P2002' && error.meta && error.meta.target && error.meta.target.includes('route')) {
            console.warn(`Skipped duplicate route: ${newData.route}`);
            // Optionally, you can throw here to rollback the whole transaction if you want strict all-or-nothing
            throw error;
          } else {
            console.error(`Error inserting page with route: ${newData.route}`, error);
            throw error; // Rollback transaction on any error
          }
        }
      }
    });
    console.log("All pages inserted successfully in a single transaction.");
  } catch (err) {
    console.error("Transaction failed. No data was inserted.", err);
  } finally {
    await prisma.$disconnect();
  }
}