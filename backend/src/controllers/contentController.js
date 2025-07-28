import prisma from "../models/prismaClient.js";
import crypto from "node:crypto";
import { logActivity } from "../utils/logger.js";

/**
 * Create a new webpage with nested content and elements.
 */
export const createWebpage = async (req, res) => {
  try {
    const { name, content } = req.body;
    const id = crypto.randomUUID();

    const webpage = await prisma.webpage.create({
      data: {
        id,
        name,
        contents: {
          create: content.map((section, sectionIndex) => ({
            id: section.id,
            name: section.name,
            order: sectionIndex,
            style: {
              create: {
                id: section.style?.id || undefined,
                xl: section.style.xl,
                lg: section.style.lg,
                md: section.style.md,
                sm: section.style.sm,
              },
            },
            elements: {
              create: section.elements.map((el, elIndex) => ({
                id: el.id,
                name: el.name,
                content: el.content,
                order: elIndex,
                style: {
                  create: {
                    id: el.style?.id || undefined,
                    xl: el.style.xl,
                    lg: el.style.lg,
                    md: el.style.md,
                    sm: el.style.sm,
                  },
                },
              })),
            },
          })),
        },
      },
      include: {
        contents: {
          orderBy: { order: "asc" },
          include: {
            style: true,
            elements: {
              orderBy: { order: "asc" },
              include: { style: true },
            },
          },
        },
      },
    });

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

/**
 * Fetch all webpages with full nested structure.
 */
export const getAllWebpages = async (req, res) => {
  try {
    const webpages = await prisma.webpage.findMany({
      include: {
        contents: {
          orderBy: { order: "asc" },
          include: {
            style: true,
            elements: {
              orderBy: { order: "asc" },
              include: { style: true },
            },
          },
        },
      },
    });

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

/**
 * Fetch a single webpage by ID with full nested structure.
 */
export const getWebpageById = async (req, res) => {
  try {
    const { id } = req.params;

    const webpage = await prisma.webpage.findUnique({
      where: { id },
      include: {
        contents: {
          orderBy: { order: "asc" },
          include: {
            style: true,
            elements: {
              orderBy: { order: "asc" },
              include: { style: true },
            },
          },
        },
      },
    });

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

/**
 * Update a webpage by ID with full nested structure.
 */
export const updateWebpageById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;

    const existingWebpage = await prisma.webpage.findUnique({ where: { id } });

    if (!existingWebpage) {
      await logActivity({
        action: "Update Webpage Failed",
        message: `Webpage with ID '${id}' not found.`,
      });
      return res.status(404).json({ error: "Webpage not found." });
    }

    await prisma.content.deleteMany({ where: { webpageId: id } });

    const updatedWebpage = await prisma.webpage.update({
      where: { id },
      data: {
        name,
        contents: {
          create: content.map((section, sectionIndex) => ({
            id: section.id,
            name: section.name,
            order: sectionIndex,
            style: {
              create: {
                id: section.style?.id || undefined,
                xl: section.style.xl,
                lg: section.style.lg,
                md: section.style.md,
                sm: section.style.sm,
              },
            },
            elements: {
              create: section.elements.map((el, elIndex) => ({
                id: el.id,
                name: el.name,
                content: el.content,
                order: elIndex,
                style: {
                  create: {
                    id: el.style?.id || undefined,
                    xl: el.style.xl,
                    lg: el.style.lg,
                    md: el.style.md,
                    sm: el.style.sm,
                  },
                },
              })),
            },
          })),
        },
      },
      include: {
        contents: {
          orderBy: { order: "asc" },
          include: {
            style: true,
            elements: {
              orderBy: { order: "asc" },
              include: { style: true },
            },
          },
        },
      },
    });

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
