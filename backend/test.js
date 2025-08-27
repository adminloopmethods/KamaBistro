// import { createWebpageService } from "./src/modules/content/content.service";
import { createWebpageService } from "./src/modules/content/content.service.js";
import JsonData from "./test.json" assert { type: "json" };
// import { createWebpageService } from "../src/modules/content/content.service.js";
createWebpageService

async function readData() {
  await createWebpageService(JsonData);
}
readData();
