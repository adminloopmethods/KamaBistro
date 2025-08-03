import {
  createWebpageService,
  getAllWebpagesService,
  getWebpageByIdService,
  updateWebpageByIdService,
} from "../services/contentServices.js";
import { logActivity } from "../utils/logger.js";

export const createWebpage = async (req, res) => {
  try {
    const { name, content } = req.body;
    const { webpage, id } = await createWebpageService({ name, content });

    await logActivity({
      action: "Webpage Created",
      message: `Webpage '${name}' created with id ${id}.`,
    });

    res.json(webpage);
  } catch (error) {
    console.error("Error creating webpage:", error);
    await logActivity({
      action: "Create Webpage Error",
      message: error.message,
    });
    res.status(500).json({ error: "Failed to create webpage." });
  }
};

export const getAllWebpages = async (req, res) => {
  try {
    const webpages = await getAllWebpagesService();

    await logActivity({
      action: "Fetched All Webpages",
      message: `Fetched ${webpages.length} webpage(s).`,
    });

    res.json(webpages);
  } catch (error) {
    console.error("Error fetching webpages:", error);
    await logActivity({
      action: "Get All Webpages Error",
      message: error.message,
    });
    res.status(500).json({ error: "Failed to fetch webpages." });
  }
};

export const getWebpageById = async (req, res) => {
  try {
    const { id } = req.params;
    const webpage = await getWebpageByIdService(id);

    if (!webpage) {
      await logActivity({
        action: "Get Webpage Failed",
        message: `Webpage with ID '${id}' not found.`,
      });
      return res.status(404).json({ error: "Webpage not found." });
    }

    await logActivity({
      action: "Fetched Webpage",
      message: `Webpage '${webpage.name}' fetched by ID ${id}.`,
    });

    res.json(webpage);
  } catch (error) {
    console.error("Error fetching webpage:", error);
    await logActivity({
      action: "Get Webpage Error",
      message: error.message,
    });
    res.status(500).json({ error: "Failed to fetch webpage." });
  }
};

export const updateWebpageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;

    const existing = await getWebpageByIdService(id);
    if (!existing) {
      await logActivity({
        action: "Update Webpage Failed",
        message: `Webpage with ID '${id}' not found.`,
      });
      return res.status(404).json({ error: "Webpage not found." });
    }

    const updatedWebpage = await updateWebpageByIdService(id, { name, content });

    await logActivity({
      action: "Webpage Updated",
      message: `Webpage '${name}' (ID: ${id}) was updated.`,
    });

    res.json(updatedWebpage);
  } catch (error) {
    console.error("Error updating webpage:", error);
    await logActivity({
      action: "Update Webpage Error",
      message: error.message,
    });
    res.status(500).json({ error: "Failed to update webpage." });
  }
};
