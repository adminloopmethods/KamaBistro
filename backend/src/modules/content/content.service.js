import prismaClient from "../../config/dbConfig.js";
import crypto from "node:crypto";

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

// ---------------- CREATE WEBPAGE ----------------
export const createWebpageService = async ({
  name,
  contents,
  route,
  editedWidth,
}) => {
  const id = crypto.randomUUID();

  // Recursive function to build Content (section) structure
  const buildContentCreate = (section, orderIndex) => {
    return {
      id: section.id,
      name: section.name,
      givenName: section.givenName || null,
      order: orderIndex,
      hover: section.hover || null,
      aria: section.aria || null,
      style: {
        create: {
          xl: section.style?.xl,
          lg: section.style?.lg,
          md: section.style?.md,
          sm: section.style?.sm,
        },
      },
      elements: {
        create: section.elements
          .filter((el) => el.name !== "section") // normal elements
          .map((el, elIndex) => ({
            id: el.id,
            name: el.name,
            content: el.content,
            hover: el.hover,
            href: el.href,
            aria: el.aria,
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
      children: {
        create: section.elements
          .filter((el) => el.name === "section") // nested sections
          .map((childSection, childIndex) =>
            buildContentCreate(childSection, childIndex)
          ),
      },
    };
  };

  const webpage = await prismaClient.webpage.create({
    data: {
      id,
      name,
      route,
      editedWidth,
      contents: {
        create: contents.map((section, sectionIndex) =>
          buildContentCreate(section, sectionIndex)
        ),
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
              children: true, // will recursively fetch deeper
            },
          },
        },
      },
    },
  });

  return { webpage, id };
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
        },
      },
    },
  });

  if (!webpage) return null;

  // Recursive loader for children
  const loadChildren = async (sectionId) => {
    const children = await prismaClient.content.findMany({
      where: { parentId: sectionId },
      orderBy: { order: "asc" },
      include: {
        style: true,
        elements: { orderBy: { order: "asc" }, include: { style: true } },
      },
    });

    for (const child of children) {
      child.children = await loadChildren(child.id); // recurse
    }

    return children;
  };

  // Attach children recursively
  for (const section of webpage.contents) {
    section.children = await loadChildren(section.id);
  }

  // Your transform function stays the same
  const transformSection = (section) => {
    const merged = [
      ...(section.children?.map((child) => ({
        id: child.id,
        name: child.name,
        givenName: child.givenName,
        style: child.style,
        hover: child.hover,
        aria: child.aria,
        order: child.order,
        type: "section",
        elements: transformSection(child).elements, // recurse
      })) || []),
      ...(section.elements?.map((el) => ({
        id: el.id,
        name: el.name,
        style: el.style,
        content: el.content,
        hover: el.hover,
        href: el.href,
        aria: el.aria,
        order: el.order,
        type: "element",
      })) || []),
    ];

    merged.sort((a, b) => a.order - b.order);

    return {
      id: section.id,
      name: section.name,
      givenName: section.givenName,
      style: section.style,
      hover: section.hover,
      aria: section.aria,
      elements: merged.map(({ order, type, ...rest }) => rest),
    };
  };

  return {
    ...webpage,
    contents: webpage.contents.map(transformSection),
  };
};


// ---------------- UPDATE WEBPAGE BY ID ----------------
export const updateWebpageByIdService = async (
  id,
  { name, contents, editedWidth, route, locationId }
) => {
  // Step 1: Update webpage info
  await prismaClient.webpage.update({
    where: { id },
    data: {
      name,
      route,
      locationId,
      ...(editedWidth !== undefined && { editedWidth }),
    },
  });

  // ---------------- DELETE MISSING ----------------
  // collect all incoming section + element IDs
  const incomingSectionIds = new Set();
  const incomingElementIds = new Set();

  function collectIncoming(sections) {
    for (const s of sections) {
      incomingSectionIds.add(s.id);
      if (s.elements) {
        for (const el of s.elements) {
          if (el.name === "section") {
            collectIncoming([el]); // recurse as section
          } else {
            incomingElementIds.add(el.id);
          }
        }
      }
      if (s.children?.length) {
        collectIncoming(s.children);
      }
    }
  }
  collectIncoming(contents);

  // delete all sections not in incoming
  await prismaClient.content.deleteMany({
    where: {
      webpageId: id,
      id: { notIn: Array.from(incomingSectionIds) },
    },
  });

  // delete all elements not in incoming
  await prismaClient.element.deleteMany({
    where: {
      contentRef: { webpageId: id },
      id: { notIn: Array.from(incomingElementIds) },
    },
  });

  // ---------------- UPSERT HELPERS ----------------
  async function upsertSection(section, parentId, order, webpageId) {
    await prismaClient.content.upsert({
      where: { id: section.id },
      update: {
        name: section.name,
        givenName: section.givenName || null,
        hover: section.hover || null,
        aria: section.aria || null,
        order,
        ...(parentId
          ? { parent: { connect: { id: parentId } } }
          : { webpage: { connect: { id: webpageId } } }),
        style: {
          upsert: {
            update: {
              xl: section.style?.xl,
              lg: section.style?.lg,
              md: section.style?.md,
              sm: section.style?.sm,
            },
            create: {
              xl: section.style?.xl,
              lg: section.style?.lg,
              md: section.style?.md,
              sm: section.style?.sm,
            },
          },
        },
      },
      create: {
        id: section.id,
        name: section.name,
        givenName: section.givenName || null,
        hover: section.hover || null,
        aria: section.aria || null,
        order,
        ...(parentId
          ? { parent: { connect: { id: parentId } } }
          : { webpage: { connect: { id: webpageId } } }),
        style: {
          create: {
            xl: section.style?.xl,
            lg: section.style?.lg,
            md: section.style?.md,
            sm: section.style?.sm,
          },
        },
      },
    });

    // process children and elements
    if (section.elements?.length) {
      for (let i = 0; i < section.elements.length; i++) {
        const el = section.elements[i];
        if (el.name === "section") {
          await upsertSection(el, section.id, i, webpageId); // nested section
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
              style: {
                upsert: {
                  update: {
                    xl: el.style?.xl,
                    lg: el.style?.lg,
                    md: el.style?.md,
                    sm: el.style?.sm,
                  },
                  create: {
                    xl: el.style?.xl,
                    lg: el.style?.lg,
                    md: el.style?.md,
                    sm: el.style?.sm,
                  },
                },
              },
            },
            create: {
              id: el.id,
              name: el.name,
              content: el.content,
              hover: el.hover,
              href: el.href,
              aria: el.aria,
              order: i,
              contentRef: { connect: { id: section.id } },
              style: {
                create: {
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

    // also handle explicit children array if present
    if (section.children?.length) {
      for (let j = 0; j < section.children.length; j++) {
        await upsertSection(section.children[j], section.id, j, webpageId);
      }
    }
  }

  // ---------------- UPSERT ROOT SECTIONS ----------------
  for (let i = 0; i < contents.length; i++) {
    await upsertSection(contents[i], null, i, id);
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

/////////// Proposed table services

export const createProposedVersionService = async (
  webpageId,
  editorId,
  data
) => {
  const {name, contents, editedWidth, route} = data;
  const webpage = await prismaClient.webpage.findUnique({
    where: { id: webpageId },
    include: {
      verifier: true,
    },
  });

  if (!webpage) {
    throw new Error("Webpage not found");
  }

  // Create the proposed version
  const proposedVersion = await prismaClient.proposedVersion.create({
    data: {
      version: {
        name,
        contents,
        editedWidth,
        route,
      },
      webpage: { connect: { id: webpageId } },
      editor: { connect: { id: editorId } },
      verifier: { connect: { id: webpage.verifierId } },
    },
    include: {
      editor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      verifier: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // return proposedVersion;
  await sendVerificationNotification(
    webpage.verifierId,
    webpageId,
    proposedVersion.id
  );

  return proposedVersion;
};

// Helper function to send notification (implement based on your notification system)
const sendVerificationNotification = async (
  verifierId,
  webpageId,
  proposalId
) => {
  // This could be an email, in-app notification, etc.
  console.log(
    `Notification sent to verifier ${verifierId} about proposal ${proposalId} for webpage ${webpageId}`
  );
};

export const getProposedVersionsService = async (verifierId) => {
  return await prismaClient.proposedVersion.findMany({
    where: {verifierId},
    include: {
      webpage: {
        select: {
          id: true,
          name: true,
          route: true,
        },
      },
      editor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {createdAt: "desc"},
  });
};

export const getProposedVersionByIdService = async (id) => {
  return await prismaClient.proposedVersion.findUnique({
    where: {id},
  });
};

export const deleteProposedVersionService = async (id) => {
  return await prismaClient.proposedVersion.delete({
    where: {id},
  });
};
