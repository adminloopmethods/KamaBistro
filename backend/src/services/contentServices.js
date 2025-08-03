import prisma from "../models/prismaClient.js ";
import crypto from "node:crypto";

export const createWebpageService = async ({ name, content }) => {
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

  return { webpage, id };
};

export const getAllWebpagesService = async () => {
  return await prisma.webpage.findMany({
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
  return await prisma.webpage.findUnique({
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
  await prisma.content.deleteMany({ where: { webpageId: id } });

  return await prisma.webpage.update({
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
};
