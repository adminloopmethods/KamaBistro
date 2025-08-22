import prismaClient from "../../config/dbConfig.js";
import crypto from "node:crypto";

// ---------------- CREATE WEBPAGE ----------------
export const createWebpageService = async ({ name, contents, route, editedWidth }) => {
  const id = crypto.randomUUID();

  const webpage = await prismaClient.webpage.create({
    data: {
      id,
      name,
      route,
      editedWidth,
      contents: {
        create: contents.map((section, sectionIndex) => {
          const childrenCreate = [];
          const elementsCreate = [];

          section.elements.forEach((el, index) => {
            if (el.name === "section") {
              childrenCreate.push({
                id: el.id,
                name: el.name,
                givenName: el.givenName || null,
                order: index, // 👈 use original index
                style: {
                  create: {
                    xl: el.style?.xl,
                    lg: el.style?.lg,
                    md: el.style?.md,
                    sm: el.style?.sm,
                  },
                },
                elements: {
                  create: el.elements.map((childEl, childIndex) => ({
                    id: childEl.id,
                    name: childEl.name,
                    content: childEl.content,
                    order: childIndex, // within its own section
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
              });
            } else {
              elementsCreate.push({
                id: el.id,
                name: el.name,
                content: el.content,
                order: index, // 👈 use original index
                style: {
                  create: {
                    xl: el.style?.xl,
                    lg: el.style?.lg,
                    md: el.style?.md,
                    sm: el.style?.sm,
                  },
                },
              });
            }
          });

          return {
            id: section.id,
            name: section.name,
            givenName: section.givenName || null,
            order: sectionIndex,
            style: {
              create: {
                xl: section.style?.xl,
                lg: section.style?.lg,
                md: section.style?.md,
                sm: section.style?.sm,
              },
            },
            children: { create: childrenCreate },
            elements: { create: elementsCreate },
          };
        }),
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

// ---------------- GET ALL WEBPAGES ----------------
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

// ---------------- GET WEBPAGE BY ID ----------------
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
            include: { style: true },
          },
          children: {
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
      },
    },
  });

  if (!webpage) return null;

  const transformSection = (section) => {
    // merge children + elements into one list with order preserved
    const merged = [
      ...(section.children?.map((child) => ({
        id: child.id,
        name: child.name,
        givenName: child.givenName,
        style: child.style,
        order: child.order, // keep order for sorting
        type: "section",
        elements: transformSection(child).elements, // recurse
      })) || []),
      ...(section.elements?.map((el) => ({
        id: el.id,
        name: el.name,
        style: el.style,
        content: el.content,
        order: el.order,
        type: "element",
      })) || []),
    ];

    // sort by order before returning
    merged.sort((a, b) => a.order - b.order);

    return {
      id: section.id,
      name: section.name,
      givenName: section.givenName,
      style: section.style,
      elements: merged.map(({ order, type, ...rest }) => rest), // remove order/type before returning
    };
  };

  return {
    ...webpage,
    contents: webpage.contents.map(transformSection),
  };
};


// ---------------- UPDATE WEBPAGE BY ID ----------------
export const updateWebpageByIdService = async (id, { name, contents, editedWidth }) => {
  // Step 1: Update webpage info
  const updatedWebpage = await prismaClient.webpage.update({
    where: { id },
    data: {
      name,
      ...(editedWidth !== undefined && { editedWidth }),
    },
  });

  // Step 2: Fetch existing contents (sections)
  const existingContents = await prismaClient.content.findMany({
    where: { webpageId: id },
    include: {
      elements: { include: { style: true } },
      children: { include: { elements: { include: { style: true } }, style: true } },
      style: true,
    },
  });

  // ---------------- DELETE MISSING SECTIONS ----------------
  const incomingSectionIds = new Set(contents.map((c) => c.id));
  const sectionsToDelete = existingContents.filter(
    (c) => !incomingSectionIds.has(c.id)
  );

  if (sectionsToDelete.length) {
    for (const section of sectionsToDelete) {
      await prismaClient.content.deleteMany({ where: { parentId: section.id } }); // delete children
      await prismaClient.content.delete({ where: { id: section.id } }); // delete parent
    }
  }


  // ---------------- DELETE MISSING ELEMENTS ----------------
  const existingElementMap = new Map();

  function flattenExisting(contentsArray) {
    for (const content of contentsArray) {
      if (content.elements) {
        for (const el of content.elements) {
          existingElementMap.set(el.id, el);
          if (el.name === "section" && el.elements) {
            flattenExisting([{ ...el, elements: el.elements }]);
          }
        }
      }
      if (content.children) {
        flattenExisting(content.children);
      }
    }
  }
  flattenExisting(existingContents);

  const incomingElementIds = new Set();
  function collectIncomingIds(elementsArray) {
    for (const el of elementsArray) {
      incomingElementIds.add(el.id);
      if (el.name === "section" && el.elements) {
        collectIncomingIds(el.elements);
      }
    }
  }
  collectIncomingIds(contents.flatMap((c) => c.elements || []));

  const elementsToDelete = Array.from(existingElementMap.values()).filter(
    (e) => !incomingElementIds.has(e.id)
  );
  if (elementsToDelete.length) {
    await prismaClient.element.deleteMany({
      where: { id: { in: elementsToDelete.map((e) => e.id) } },
    });
  }

  // ---------------- UPSERT ELEMENTS ----------------
  async function upsertElements(parentId, elementsArray) {
    for (let i = 0; i < elementsArray.length; i++) {
      const el = elementsArray[i];
      if (el.name === "section") {
        await prismaClient.content.upsert({
          where: { id: el.id },
          update: {
            name: el.name,
            givenName: el.givenName || null,
            order: i,
            parent: { connect: { id: parentId } },
            style: { update: el.style || {} },
          },
          create: {
            id: el.id,
            name: el.name,
            givenName: el.givenName || null,
            order: i,
            parent: { connect: { id: parentId } },
            style: { create: el.style || {} },
          },
        });
        if (el.elements?.length) {
          await upsertElements(el.id, el.elements);
        }
      } else {
        await prismaClient.element.upsert({
          where: { id: el.id },
          update: {
            name: el.name,
            content: el.content,
            order: i,
            style: { update: el.style || {} },
          },
          create: {
            id: el.id,
            name: el.name,
            content: el.content,
            order: i,
            contentRef: { connect: { id: parentId } },
            style: { create: el.style || {} },
          },
        });
      }
    }
  }

  // ---------------- UPSERT SECTIONS ----------------
  for (let i = 0; i < contents.length; i++) {
    const section = contents[i];
    await prismaClient.content.upsert({
      where: { id: section.id },
      update: {
        name: section.name,
        givenName: section.givenName || null,
        order: i,
        style: { update: section.style || {} },
      },
      create: {
        id: section.id,
        name: section.name,
        givenName: section.givenName || null,
        order: i,
        webpage: { connect: { id } },
        style: { create: section.style || {} },
      },
    });
    if (section.elements?.length) {
      await upsertElements(section.id, section.elements);
    }
  }

  // Step 3: Return updated snapshot
  const finalWebpage = await prismaClient.webpage.findUnique({
    where: { id },
    include: {
      contents: {
        orderBy: { order: "asc" },
        include: {
          style: true,
          elements: { orderBy: { order: "asc" }, include: { style: true } },
          children: {
            orderBy: { order: "asc" },
            include: { style: true, elements: { orderBy: { order: "asc" }, include: { style: true } } },
          },
        },
      },
    },
  });

  // Step 4: Save version snapshot
  await prismaClient.version.create({
    data: {
      webpageId: id,
      version: finalWebpage,
    },
  });

  return finalWebpage;
};


// ---------------- GET WEBPAGE VERSIONS ----------------
export const getWebpageVersionsService = async (webpageId) => {
  return await prismaClient.version.findMany({
    where: { webpageId },
    orderBy: { id: "desc" },
  });
};

// ---------------- FIND WEBPAGE ID BY ROUTE ----------------
export const findWebpageIdByRouteService = async (route) => {
  console.log(route)
  const page = await prismaClient.webpage.findUnique({
    where: { route },
    select: { id: true },
  });

  return page ? page.id : null;
};

// get services
// ---------------- GET ALL CONTENTS ----------------
export const getAllContentsService = async () => {
  const contents = await prismaClient.content.findMany({
    select: {
      id: true,
      givenName: true,
    },
    // orderBy: {
    //   createdAt: "asc", // optional: keep ordering consistent
    // },
  });

  // Normalize to always return string (avoid nulls if you prefer empty string)
  return contents.map(c => ({
    id: c.id,
    givenName: c.givenName ?? "",
  }));
};


// ---------------- GET CONTENT BY ID ----------------
// ---------------- GET CONTENT BY ID (regenerate IDs) ----------------
export const getContentByIdService = async (id) => {
  const section = await prismaClient.content.findUnique({
    where: { id },
    include: {
      style: true,
      elements: {
        orderBy: { order: "asc" },
        include: { style: true },
      },
      children: {
        orderBy: { order: "asc" },
        include: {
          style: true,
          elements: { orderBy: { order: "asc" }, include: { style: true } },
        },
      },
    },
  });

  if (!section) return null;

  const transformSection = (section) => {
    const merged = [
      ...(section.children?.map((child) => ({
        id: crypto.randomUUID(), // new id for child
        name: child.name,
        givenName: child.givenName,
        style: child.style
          ? { ...child.style, id: crypto.randomUUID() } // new style id
          : null,
        order: child.order,
        type: "section",
        elements: transformSection(child).elements,
      })) || []),
      ...(section.elements?.map((el) => ({
        id: crypto.randomUUID(), // new id for element
        name: el.name,
        style: el.style
          ? { ...el.style, id: crypto.randomUUID() } // new style id
          : null,
        content: el.content,
        order: el.order,
        type: "element",
      })) || []),
    ];

    merged.sort((a, b) => a.order - b.order);

    return {
      id: crypto.randomUUID(), // new id for parent section
      name: section.name,
      givenName: section.givenName,
      style: section.style
        ? { ...section.style, id: crypto.randomUUID() } // new style id
        : null,
      elements: merged.map(({ order, type, ...rest }) => rest), // drop order/type
    };
  };

  return transformSection(section);
};