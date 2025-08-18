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
  const webpage = await prismaClient.webpage.findUnique({
    where: { id },
    include: {
      contents: {
        orderBy: { order: "asc" },
        include: {
          style: true,
          elements: {
            orderBy: { order: "asc" },
            include: {
              style: true,
            },
          },
          children: {
            orderBy: { order: "asc" },
            include: {
              style: true,
              elements: {
                orderBy: { order: "asc" },
                include: {
                  style: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!webpage) return null;

  const transformSection = (section) => {
    return {
      id: section.id,
      name: section.name,
      style: section.style,
      elements: [
        ...(section.children?.map((child) => transformSection(child)) || []),
        ...(section.elements?.map((el) => ({
          id: el.id,
          name: el.name,
          style: el.style,
          content: el.content,
        })) || []),
      ],
    };
  };

  return {
    ...webpage,
    contents: webpage.contents.map(transformSection),
  };
};

export const updateWebpageByIdService = async (id, { name, contents, route }) => {
  // Step 1: Update webpage basic info
  const updatedWebpage = await prismaClient.webpage.update({
    where: { id },
    data: { name, route },
  });

  // Step 2: Sync top-level contents
  const existingContents = await prismaClient.content.findMany({
    where: { webpageId: id },
    include: { elements: true, children: true },
  });

  const existingContentMap = new Map(existingContents.map(c => [c.id, c]));
  const incomingContentIds = new Set(contents.map(c => c.id));

  // Delete missing contents
  const contentsToDelete = existingContents.filter(c => !incomingContentIds.has(c.id));
  if (contentsToDelete.length) {
    await prismaClient.content.deleteMany({
      where: { id: { in: contentsToDelete.map(c => c.id) } },
    });
  }

  // Upsert each section
  for (let sectionIndex = 0; sectionIndex < contents.length; sectionIndex++) {
    const section = contents[sectionIndex];

    await prismaClient.content.upsert({
      where: { id: section.id },
      update: {
        name: section.name,
        order: sectionIndex,
        style: {
          update: {
            xl: section.style?.xl,
            lg: section.style?.lg,
            md: section.style?.md,
            sm: section.style?.sm,
          },
        },
      },
      create: {
        id: section.id,
        name: section.name,
        order: sectionIndex,
        webpage: { connect: { id } }, // ✅ FIX
        style: {
          create: {
            id: section.style?.id || undefined,
            xl: section.style?.xl,
            lg: section.style?.lg,
            md: section.style?.md,
            sm: section.style?.sm,
          },
        },
      },
    });

    // --- Elements sync ---
    const existingEls = existingContentMap.get(section.id)?.elements ?? [];
    const existingElMap = new Map(existingEls.map(e => [e.id, e]));
    const incomingElIds = new Set(section.elements.map(e => e.id));

    // Delete missing elements
    const elsToDelete = existingEls.filter(e => !incomingElIds.has(e.id));
    if (elsToDelete.length) {
      await prismaClient.element.deleteMany({
        where: { id: { in: elsToDelete.map(e => e.id) } },
      });
    }

    // Upsert each element
    for (let elIndex = 0; elIndex < section.elements.length; elIndex++) {
      const el = section.elements[elIndex];

      if (el.name === "section") {
        // Nested section (only 1 level deep per your schema)
        await prismaClient.content.upsert({
          where: { id: el.id },
          update: {
            name: el.name,
            order: elIndex,
            parent: { connect: { id: section.id } }, // ✅ FIX
            style: {
              update: {
                xl: el.style?.xl,
                lg: el.style?.lg,
                md: el.style?.md,
                sm: el.style?.sm,
              },
            },
          },
          create: {
            id: el.id,
            name: el.name,
            order: elIndex,
            parent: { connect: { id: section.id } }, // ✅ FIX
            style: {
              create: {
                id: el.style?.id || undefined,
                xl: el.style?.xl,
                lg: el.style?.lg,
                md: el.style?.md,
                sm: el.style?.sm,
              },
            },
          },
        });

        // Now sync its child elements
        const existingChildren = existingContentMap.get(el.id)?.elements ?? [];
        const existingChildMap = new Map(existingChildren.map(c => [c.id, c]));
        const incomingChildIds = new Set(el.elements.map(c => c.id));

        // Delete children not in payload
        const childrenToDelete = existingChildren.filter(c => !incomingChildIds.has(c.id));
        if (childrenToDelete.length) {
          await prismaClient.element.deleteMany({
            where: { id: { in: childrenToDelete.map(c => c.id) } },
          });
        }

        // Upsert children
        for (let childIndex = 0; childIndex < el.elements.length; childIndex++) {
          const child = el.elements[childIndex];
          await prismaClient.element.upsert({
            where: { id: child.id },
            update: {
              name: child.name,
              content: child.content,
              order: childIndex,
              style: {
                update: {
                  xl: child.style?.xl,
                  lg: child.style?.lg,
                  md: child.style?.md,
                  sm: child.style?.sm,
                },
              },
            },
            create: {
              id: child.id,
              name: child.name,
              content: child.content,
              order: childIndex,
              contentRef: { connect: { id: el.id } }, // ✅ FIX
              style: {
                create: {
                  id: child.style?.id || undefined,
                  xl: child.style?.xl,
                  lg: child.style?.lg,
                  md: child.style?.md,
                  sm: child.style?.sm,
                },
              },
            },
          });
        }
      } else {
        // Normal element (h1, p, etc.)
        await prismaClient.element.upsert({
          where: { id: el.id },
          update: {
            name: el.name,
            content: el.content,
            order: elIndex,
            style: {
              update: {
                xl: el.style?.xl,
                lg: el.style?.lg,
                md: el.style?.md,
                sm: el.style?.sm,
              },
            },
          },
          create: {
            id: el.id,
            name: el.name,
            content: el.content,
            order: elIndex,
            contentRef: { connect: { id: section.id } }, // ✅ FIX
            style: {
              create: {
                id: el.style?.id || undefined,
                xl: el.style?.xl,
                lg: el.style?.lg,
                md: el.style?.md,
                sm: el.style?.sm,
              },
            },
          },
        });
      }
    }
  }

  // Step 3: Return updated snapshot with relations
  const finalWebpage = await prismaClient.webpage.findUnique({
    where: { id },
    include: {
      contents: {
        orderBy: { order: "asc" },
        include: {
          style: true,
          children: {
            orderBy: { order: "asc" },
            include: { style: true },
          },
          elements: {
            orderBy: { order: "asc" },
            include: { style: true },
          },
        },
      },
    },
  });

  // Step 4: Save snapshot in version table
  await prismaClient.version.create({
    data: {
      webpageId: id,
      version: finalWebpage,
    },
  });

  return finalWebpage;
};





export const getWebpageVersionsService = async (webpageId) => {
  return await prismaClient.version.findMany({
    where: { webpageId },
    orderBy: { id: 'desc' },
  });
};

