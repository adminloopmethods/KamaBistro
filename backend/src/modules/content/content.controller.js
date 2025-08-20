import { logger } from "../../config/logConfig.js";
import {
  createWebpageService,
  getAllWebpagesService,
  getWebpageByIdService,
  updateWebpageByIdService,
  findWebpageIdByRouteService,
} from "./content.service.js";

export const createWebpage = async (req, res) => {
  try {
    const { name, contents, route, editedWidth } = req.body;
    const { webpage } = await createWebpageService({ name, contents, route, editedWidth });
    res.json(webpage);
  } catch (error) {
    logger.error(`Error creating webpage: ${error.message}`, { error });
    res.status(500).json({ error: "Failed to create webpage." });
  }
};

export const getAllWebpages = async (req, res) => {
  try {
    const webpages = await getAllWebpagesService();
    res.json({ webpages });
  } catch (error) {
    logger.error(`Error fetching webpages: ${error.message}`, { error });
    res.status(500).json({ error: "Failed to fetch webpages." });
  }
};

export const getWebpageById = async (req, res) => {
  try {
    const { id } = req.params;
    const webpage = await getWebpageByIdService(id);

    if (!webpage) {
      logger.warn(`Webpage with ID '${id}' not found.`);
      return res.status(404).json({ error: "Webpage not found." });
    }

    res.json({ webpage });
  } catch (error) {
    logger.error(`Error fetching webpage: ${error.message}`, { error });
    res.status(500).json({ error: "Failed to fetch webpage." });
  }
};

export const updateWebpageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contents, route, editedWidth } = req.body;

    const existing = await getWebpageByIdService(id);
    if (!existing) {
      logger.warn(`Webpage with ID '${id}' not found.`);
      return res.status(404).json({ error: "Webpage not found." });
    }

    const updatedWebpage = await updateWebpageByIdService(id, { name, contents, route, editedWidth });
    res.json(updatedWebpage);
  } catch (error) {
    logger.error(`Error updating webpage: ${error.message}`, { error });
    res.status(500).json({ error: "Failed to update webpage." });
  }
};

// ---------------- GET WEBPAGE BY ROUTE ----------------
export const getWebpageByRoute = async (req, res) => {
  try {
    const { route } = req.params;
    console.log(route)
    // Get the ID from route
    const id = await findWebpageIdByRouteService(route === "home" ? "/" : `/${route}`);

    if (!id) {
      logger.warn(`Webpage with route '${route}' not found.`);
      return res.status(404).json({ error: "Webpage not found." });
    }

    // Reuse existing ID-based service
    const webpage = await getWebpageByIdService(id);

    res.json({ webpage });
  } catch (error) {
    logger.error(`Error fetching webpage by route: ${error.message}`, { error });
    res.status(500).json({ error: "Failed to fetch webpage by route." });
  }
};
