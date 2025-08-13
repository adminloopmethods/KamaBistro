import { logger } from "../../config/logConfig.js";
import {
  createWebpageService,
  getAllWebpagesService,
  getWebpageByIdService,
  updateWebpageByIdService,
} from "./content.service.js";

export const createWebpage = async (req, res) => {
  console.log("at create page")
  try {
    const { name, content, route } = req.body;
    const { webpage } = await createWebpageService({ name, content, route });
    res.json(webpage);
  } catch (error) {
    logger.error(`Error creating webpage: ${error.message}`, { error });
    res.status(500).json({ error: "Failed to create webpage." });
  }
};

export const getAllWebpages = async (req, res) => {
  console.log("at get all webpages")
  
  try {
    const webpages = await getAllWebpagesService();
    res.json(webpages);
  } catch (error) {
    logger.error(`Error fetching webpages: ${error.message}`, { error });
    res.status(500).json({ error: "Failed to fetch webpages." });
  }
};

export const getWebpageById = async (req, res) => {
  console.log("at create page")
  try {
    const { id } = req.params;
    const webpage = await getWebpageByIdService(id);

    if (!webpage) {
      logger.warn(`Webpage with ID '${id}' not found.`);
      return res.status(404).json({ error: "Webpage not found." });
    }

    res.json(webpage);
  } catch (error) {
    logger.error(`Error fetching webpage: ${error.message}`, { error });
    res.status(500).json({ error: "Failed to fetch webpage." });
  }
};

export const updateWebpageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;

    const existing = await getWebpageByIdService(id);
    if (!existing) {
      logger.warn(`Webpage with ID '${id}' not found.`);
      return res.status(404).json({ error: "Webpage not found." });
    }

    const updatedWebpage = await updateWebpageByIdService(id, { name, content });
    res.json(updatedWebpage);
  } catch (error) {
    logger.error(`Error updating webpage: ${error.message}`, { error });
    res.status(500).json({ error: "Failed to update webpage." });
  }
};
