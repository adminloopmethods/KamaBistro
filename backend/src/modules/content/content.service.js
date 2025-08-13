import prismaClient from "../../config/dbConfig.js";
import crypto from "node:crypto";

export const createWebpageService = async ({ name, content, route }) => {
  const id = crypto.randomUUID();

  const webpage = await prismaClient.webpage.create({
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
      route: route
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

  // Create a version snapshot
  await prismaClient.version.create({
    data: {
      webpageId: id,
      version: webpage, // Full snapshot of the page in JSON
    },
  });

  return { webpage, id };
};


export const getAllWebpagesService = async () => {
  return await prismaClient.webpage.findMany({
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
};

export const getWebpageByIdService = async (id) => {
  console.log(id)
  return await prismaClient.webpage.findUnique({
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
};

export const updateWebpageByIdService = async (id, { name, content }) => {
  await prismaClient.content.deleteMany({ where: { webpageId: id } });

  const updatedWebpage = await prismaClient.webpage.update({
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

  // Create a new version snapshot after update
  await prismaClient.version.create({
    data: {
      webpageId: id,
      version: updatedWebpage,
    },
  });

  return updatedWebpage;
};


export const getWebpageVersionsService = async (webpageId) => {
  return await prismaClient.version.findMany({
    where: { webpageId },
    orderBy: { id: 'desc' },
  });
};

