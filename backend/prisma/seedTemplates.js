// Import dependencies
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
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