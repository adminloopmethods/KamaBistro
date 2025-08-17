import prismaClient from "../../config/dbConfig.js";
import crypto from "node:crypto";

export const createWebpageService = async ({ name, contents, route }) => {
  const id = crypto.randomUUID();

  const webpage = await prismaClient.webpage.create({
    data: {
      id,
      name,
      route,
      contents: {
        create: contents.map((section, sectionIndex) => ({
          id: section.id,
          name: section.name,
          order: sectionIndex,
          style: {
            create: {
              xl: section.style?.xl,
              lg: section.style?.lg,
              md: section.style?.md,
              sm: section.style?.sm,
            },
          },
          // ✅ FIXED children block
          children: {
            create: section.elements
              .filter((el) => el.name === "section")
              .map((nested, nestedIndex) => ({
                id: nested.id,
                name: nested.name,
                order: nestedIndex,
                style: {
                  create: {
                    xl: nested.style?.xl,
                    lg: nested.style?.lg,
                    md: nested.style?.md,
                    sm: nested.style?.sm,
                  },
                },
                elements: {
                  create: nested.elements.map((childEl, childIndex) => ({
                    id: childEl.id,
                    name: childEl.name,
                    content: childEl.content,
                    order: childIndex,
                    style: {
                      create: {
                        xl: childEl.style?.xl,
                        lg: childEl.style?.lg,
                        md: childEl.style?.md,
                        sm: childEl.style?.sm,
                      },
                    },
                  })),
                },
              })),
          },
          elements: {
            create: section.elements
              .filter((el) => el.name !== "section")
              .map((el, elIndex) => ({
                id: el.id,
                name: el.name,
                content: el.content,
                order: elIndex,
                style: {
                  create: {
                    xl: el.style?.xl,
                    lg: el.style?.lg,
                    md: el.style?.md,
                    sm: el.style?.sm,
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
          elements: { orderBy: { order: "asc" }, include: { style: true } },
          children: {
            orderBy: { order: "asc" },
            include: {
              style: true,
              elements: { orderBy: { order: "asc" }, include: { style: true } },
            },
          },
        },
      },
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

