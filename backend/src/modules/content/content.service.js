import prismaClient from "../../config/dbConfig.js";
import crypto from "node:crypto";

// ---------------- CREATE WEBPAGE ----------------
export const createWebpageService = async ({
  name,
  contents,
  route,
  editedWidth,
}) => {
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
                order: index,
                hover: el.hover || null, // ✅ now saving
                aria: el.aria || null, // ✅ now saving
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
                    hover: childEl.hover,
                    href: childEl.href,
                    aria: childEl.aria,
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
              });
            } else {
              elementsCreate.push({
                id: el.id,
                name: el.name,
                content: el.content,
                hover: el.hover,
                href: el.href,
                aria: el.aria,
                order: index,
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
            hover: section.hover || null, // ✅ now saving
            aria: section.aria || null, // ✅ now saving
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
      editor: true,
      verifier: true,
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

// services/contentService.js
export const getAssignedWebpagesService = async (userId) => {
  return await prismaClient.webpage.findMany({
    where: {
      OR: [{ editorId: userId }, { verifierId: userId }],
    },
    include: {
      editor: true,
      verifier: true,
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
        hover: child.hover, // ✅ now included
        aria: child.aria, // ✅ now included
        order: child.order,
        type: "section",
        elements: transformSection(child).elements, // recurse
      })) || []),
      ...(section.elements?.map((el) => ({
        id: el.id,
        name: el.name,
        style: el.style,
        content: el.content,
        hover: el.hover, // ✅ already included
        href: el.href,
        aria: el.aria, // ✅ already included
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
      hover: section.hover, // ✅ added
      aria: section.aria, // ✅ added
      elements: merged.map(({ order, type, ...rest }) => rest), // clean output
    };
  };

  return {
    ...webpage,
    contents: webpage.contents.map(transformSection),
  };
};

// ---------------- UPDATE WEBPAGE BY ID ----------------
export const updateWebpageByIdService = async (id, { name, contents, editedWidth, route }) => {
  // Step 1: Update webpage info
  const updatedWebpage = await prismaClient.webpage.update({
    where: { id },
    data: {
      name,
      route,
      ...(editedWidth !== undefined && { editedWidth }),
    },
  });

  // Step 2: Fetch existing contents
  const existingContents = await prismaClient.content.findMany({
    where: { webpageId: id },
    include: {
      elements: { include: { style: true } },
      children: { include: { elements: { include: { style: true } }, style: true } },
      style: true,
    },
  });

  // ---------------- DELETE MISSING SECTIONS ----------------
  function collectSectionIds(sections, set) {
    for (const s of sections) {
      set.add(s.id);
      if (s.children?.length) collectSectionIds(s.children, set);
      if (s.elements?.length) {
        const nestedSections = s.elements.filter((el) => el.name === "section");
        collectSectionIds(nestedSections, set);
      }
    }
  }

  const incomingSectionIds = new Set();
  collectSectionIds(contents, incomingSectionIds);

  function collectExistingSections(contentsArray, all = []) {
    for (const c of contentsArray) {
      all.push(c);
      if (c.children?.length) collectExistingSections(c.children, all);
    }
    return all;
  }

  const allExistingSections = collectExistingSections(existingContents);
  const sectionsToDeleteIds = allExistingSections
    .filter((c) => !incomingSectionIds.has(c.id))
    .map((s) => s.id);

  // Recursive delete: children -> elements -> parent
  async function deleteSectionRecursively(sectionIds) {
    for (const id of sectionIds) {
      const section = await prismaClient.content.findUnique({
        where: { id },
        include: { elements: true, children: true },
      });

      if (!section) continue;

      // Delete child sections recursively
      if (section.children?.length) {
        await deleteSectionRecursively(section.children.map((c) => c.id));
      }

      // Delete elements in this section
      if (section.elements?.length) {
        await prismaClient.element.deleteMany({
          where: { id: { in: section.elements.map((e) => e.id) } },
        });
      }

      // Delete this section
      await prismaClient.content.delete({ where: { id } });
    }
  }

  if (sectionsToDeleteIds.length) {
    await deleteSectionRecursively(sectionsToDeleteIds);
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
      if (content.children) flattenExisting(content.children);
    }
  }
  flattenExisting(existingContents);

  const incomingElementIds = new Set();
  function collectIncomingIds(elementsArray) {
    for (const el of elementsArray) {
      incomingElementIds.add(el.id);
      if (el.name === "section" && el.elements) collectIncomingIds(el.elements);
    }
  }
  collectIncomingIds(contents.flatMap((c) => c.elements || []));

  const elementsToDeleteIds = Array.from(existingElementMap.values())
    .filter((e) => !incomingElementIds.has(e.id))
    .map((e) => e.id);

  if (elementsToDeleteIds.length) {
    await prismaClient.element.deleteMany({
      where: { id: { in: elementsToDeleteIds } },
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
            hover: el.hover || null,
            aria: el.aria || null,
            order: i,
            parent: { connect: { id: parentId } },
            style: { update: el.style || {} },
          },
          create: {
            id: el.id,
            name: el.name,
            givenName: el.givenName || null,
            hover: el.hover || null,
            aria: el.aria || null,
            order: i,
            parent: { connect: { id: parentId } },
            style: { create: el.style || {} },
          },
        });
        if (el.elements?.length) await upsertElements(el.id, el.elements);
      } else {
        await prismaClient.element.upsert({
          where: { id: el.id },
          update: {
            name: el.name,
            content: el.content,
            hover: el.hover,
            href: el.href,
            aria: el.aria,
            order: i,
            style: { update: el.style || {} },
          },
          create: {
            id: el.id,
            name: el.name,
            content: el.content,
            hover: el.hover,
            href: el.href,
            aria: el.aria,
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
        hover: section.hover || null,
        aria: section.aria || null,
        order: i,
        style: { update: section.style || {} },
      },
      create: {
        id: section.id,
        name: section.name,
        givenName: section.givenName || null,
        hover: section.hover || null,
        aria: section.aria || null,
        order: i,
        webpage: { connect: { id } },
        style: { create: section.style || {} },
      },
    });
    if (section.elements?.length) await upsertElements(section.id, section.elements);
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
            include: {
              style: true,
              elements: { orderBy: { order: "asc" }, include: { style: true } },
            },
          },
        },
      },
    },
  });

  // Step 4: Save version snapshot
  await prismaClient.version.create({
    data: { webpageId: id, version: finalWebpage },
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
  console.log(route);
  const page = await prismaClient.webpage.findUnique({
    where: { route },
    select: { id: true },
  });

  return page ? page.id : null;
};

// get sections
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
  return contents.map((c) => ({
    id: c.id,
    givenName: c.givenName ?? "",
  }));
};

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
        id: crypto.randomUUID(),
        name: child.name,
        givenName: child.givenName,
        hover: child.hover || null,
        aria: child.aria || null,
        style: child.style
          ? { ...child.style, id: undefined } // clear id
          : null,
        order: child.order,
        type: "section",
        elements: transformSection(child).elements,
      })) || []),
      ...(section.elements?.map((el) => ({
        id: crypto.randomUUID(),
        name: el.name,
        content: el.content,
        hover: el.hover || null,
        aria: el.aria || null,
        style: el.style
          ? { ...el.style, id: undefined } // clear id
          : null,
        order: el.order,
        type: "element",
      })) || []),
    ];

    merged.sort((a, b) => a.order - b.order);

    return {
      id: crypto.randomUUID(),
      name: section.name,
      givenName: section.givenName,
      hover: section.hover || null,
      aria: section.aria || null,
      style: section.style
        ? { ...section.style, id: undefined } // clear id
        : null,
      elements: merged.map(({ order, type, ...rest }) => rest), // drop order/type
    };
  };

  return transformSection(section);
};

// export async function clearAllTables() {
//   await prismaClient.element.deleteMany({});
//   await prismaClient.content.deleteMany({});
//   await prismaClient.style.deleteMany({});
//   await prismaClient.version.deleteMany({});
//   await prismaClient.proposedVersion.deleteMany({});
//   await prismaClient.draft.deleteMany({});
//   await prismaClient.webpage.deleteMany({});
// }

// async function clearWebpagesData() {

//   clearAllTables()
//     .then(() => {
//       console.log("✅ All tables cleared successfully!");
//     })
//     .catch((err) => {
//       console.error("❌ Error clearing tables:", err);
//     })
//     .finally(async () => {
//       await prismaClient.$disconnect();
//     });
// }