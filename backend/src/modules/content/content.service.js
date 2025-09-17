import prismaClient from "../../config/dbConfig.js";
import crypto from "node:crypto";

// ---------------- GET ALL WEBPAGES ----------------
export const getAllWebpagesService = async () => {
  return await prismaClient.webpage.findMany({
    include: {
      editor: true,
      verifier: true,
      contents: {
        orderBy: {order: "asc"},
        include: {
          style: true,
          elements: {
            orderBy: {order: "asc"},
            include: {style: true},
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
      OR: [{editorId: userId}, {verifierId: userId}],
    },
    include: {
      editor: true,
      verifier: true,
      contents: {
        orderBy: {order: "asc"},
        include: {
          style: true,
          elements: {
            orderBy: {order: "asc"},
            include: {style: true},
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
        orderBy: {order: "asc"},
        include: {
          style: true,
          elements: {orderBy: {order: "asc"}, include: {style: true}},
          children: {
            orderBy: {order: "asc"},
            include: {
              style: true,
              elements: {orderBy: {order: "asc"}, include: {style: true}},
              children: true, // will recursively fetch deeper
            },
          },
        },
      },
    },
  });

  return {webpage, id};
};

// ---------------- GET WEBPAGE BY ID ----------------
export const getWebpageByIdService = async (id) => {
  const webpage = await prismaClient.webpage.findUnique({
    where: {id},
    include: {
      contents: {
        orderBy: {order: "asc"},
        include: {
          style: true,
          elements: {
            orderBy: {order: "asc"},
            include: {style: true},
          },
        },
      },
    },
  });

  if (!webpage) return null;

  // Recursive loader for children
  const loadChildren = async (sectionId) => {
    const children = await prismaClient.content.findMany({
      where: {parentId: sectionId},
      orderBy: {order: "asc"},
      include: {
        style: true,
        elements: {orderBy: {order: "asc"}, include: {style: true}},
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
      elements: merged.map(({order, type, ...rest}) => rest),
    };
  };

  return {
    ...webpage,
    contents: webpage.contents.map(transformSection),
  };
};

export const updateWebpageByIdService = async (
  id,
  {name, contents, editedWidth, route, locationId}
) => {
  // 1) Update webpage meta
  await prismaClient.webpage.update({
    where: {id},
    data: {
      name,
      route,
      locationId,
      ...(editedWidth !== undefined && {editedWidth}),
    },
  });

  // ---------------- COLLECT INCOMING ----------------
  const incomingSectionIds = new Set();
  const incomingElementIds = new Set();

  function collectIncoming(sections) {
    for (const s of sections) {
      incomingSectionIds.add(s.id);
      if (s.elements) {
        for (const el of s.elements) {
          if (el.name === "section") {
            collectIncoming([el]); // nested-as-element
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

  // ---------------- FETCH ALL EXISTING SECTIONS (ARBITRARY DEPTH) ----------------
  // We'll collect {id, parentId} for every Content node that belongs to this webpage
  const allNodesMap = new Map(); // id -> { id, parentId }

  // Seed: top-level sections (webpageId = id)
  let seed = await prismaClient.content.findMany({
    where: {webpageId: id},
    select: {id: true, parentId: true},
  });

  seed.forEach((n) => allNodesMap.set(n.id, n));
  let queueIds = seed.map((n) => n.id);

  // BFS: repeatedly fetch children of the last level
  while (queueIds.length) {
    const children = await prismaClient.content.findMany({
      where: {parentId: {in: queueIds}},
      select: {id: true, parentId: true},
    });

    const newChildren = children.filter((c) => !allNodesMap.has(c.id));
    if (newChildren.length === 0) break;

    newChildren.forEach((c) => allNodesMap.set(c.id, c));
    queueIds = newChildren.map((c) => c.id);
  }

  const allSectionIds = Array.from(allNodesMap.keys());

  // ---------------- FIND SECTIONS TO DELETE ----------------
  const toDeleteIds = allSectionIds.filter(
    (sid) => !incomingSectionIds.has(sid)
  );
  if (toDeleteIds.length) {
    // Build parent -> children map for nodes we fetched
    const childrenMap = new Map(); // parentId -> [childId,...]
    for (const node of allNodesMap.values()) {
      const p = node.parentId || null;
      if (!childrenMap.has(p)) childrenMap.set(p, []);
      childrenMap.get(p).push(node.id);
    }

    // Delete in leaf-first batches to satisfy onDelete: Restrict
    const toDeleteSet = new Set(toDeleteIds);
    while (toDeleteSet.size > 0) {
      const leaves = [];
      for (const candidate of toDeleteSet) {
        const kids = childrenMap.get(candidate) || [];
        // if none of its children are also in toDeleteSet, it's a leaf (safe to delete)
        const hasChildInDeleteSet = kids.some((k) => toDeleteSet.has(k));
        if (!hasChildInDeleteSet) leaves.push(candidate);
      }

      // Safety fallback (shouldn't happen for a tree) to avoid infinite loop:
      if (leaves.length === 0) {
        // fallback: delete whatever remains (best-effort) — but normally we should always find leaves
        leaves.push(...Array.from(toDeleteSet));
      }

      await prismaClient.content.deleteMany({
        where: {id: {in: leaves}},
      });

      leaves.forEach((l) => toDeleteSet.delete(l));
    }
  }

  // ---------------- DELETE ELEMENTS NOT INCOMING (FOR ALL SECTIONS) ----------------
  // Use contentId IN allSectionIds so nested-section elements are also considered
  if (allSectionIds.length) {
    await prismaClient.element.deleteMany({
      where: {
        contentId: {in: allSectionIds},
        id: {notIn: Array.from(incomingElementIds)},
      },
    });
  }

  // ---------------- UPSERT HELPERS ----------------
  async function upsertSection(section, parentId, order, webpageId) {
    await prismaClient.content.upsert({
      where: {id: section.id},
      update: {
        name: section.name,
        givenName: section.givenName || null,
        hover: section.hover || null,
        aria: section.aria || null,
        order,
        ...(parentId
          ? {parent: {connect: {id: parentId}}}
          : {webpage: {connect: {id: webpageId}}}),
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
          ? {parent: {connect: {id: parentId}}}
          : {webpage: {connect: {id: webpageId}}}),
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

    // elements & nested-as-elements
    if (section.elements?.length) {
      for (let i = 0; i < section.elements.length; i++) {
        const el = section.elements[i];
        if (el.name === "section") {
          await upsertSection(el, section.id, i, webpageId);
        } else {
          await prismaClient.element.upsert({
            where: {id: el.id},
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
              contentRef: {connect: {id: section.id}},
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

    // explicit children array
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
    where: {id},
    include: {
      contents: {
        orderBy: {order: "asc"},
        include: {
          style: true,
          elements: {orderBy: {order: "asc"}, include: {style: true}},
          children: {
            orderBy: {order: "asc"},
            include: {
              style: true,
              elements: {orderBy: {order: "asc"}, include: {style: true}},
              // UI depth in findUnique is mainly for returning to caller; upsert traversal already handled
            },
          },
        },
      },
    },
  });

  // Step 4: Save version snapshot
  await prismaClient.version.create({
    data: {webpageId: id, version: finalWebpage},
  });

  return finalWebpage;
};

// ---------------- GET WEBPAGE VERSIONS ----------------
export const getWebpageVersionsService = async (webpageId) => {
  return await prismaClient.version.findMany({
    where: {webpageId},
    orderBy: {id: "desc"},
  });
};

// ---------------- FIND WEBPAGE ID BY ROUTE ----------------
export const findWebpageIdByRouteService = async (route, location) => {
  let page;

  // Normalize falsey location values
  const isNoLocation =
    !location || location === "false" || location === "null" || location === "";

  if (isNoLocation) {
    // Case: general (non-location) page
    page = await prismaClient.webpage.findFirst({
      where: {
        route,
        OR: [{locationId: null}, {locationId: ""}],
      },
      select: {id: true},
    });
  } else {
    // Case: specific location page
    page = await prismaClient.webpage.findFirst({
      where: {route, locationId: location},
      select: {id: true},
    });
  }

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
    where: {id},
    include: {
      style: true,
      elements: {
        orderBy: {order: "asc"},
        include: {style: true},
      },
      // remove children here (we'll fetch recursively) or leave it — it's not required
    },
  });

  if (!section) return null;

  // recursive loader
  const loadChildren = async (parentId) => {
    const children = await prismaClient.content.findMany({
      where: {parentId},
      orderBy: {order: "asc"},
      include: {
        style: true,
        elements: {orderBy: {order: "asc"}, include: {style: true}},
      },
    });

    for (const child of children) {
      child.children = await loadChildren(child.id); // recurse
    }

    return children;
  };

  // attach full tree under the root section
  section.children = await loadChildren(section.id);

  // same transformSection you already have (keeps your random UUID regeneration)
  const transformSection = (section) => {
    const merged = [
      ...(section.children?.map((child) => ({
        id: crypto.randomUUID(),
        name: child.name,
        givenName: child.givenName,
        hover: child.hover || null,
        aria: child.aria || null,
        style: child.style ? {...child.style, id: undefined} : null,
        order: child.order,
        type: "section",
        elements: transformSection(child).elements, // recurse
      })) || []),
      ...(section.elements?.map((el) => ({
        id: crypto.randomUUID(),
        name: el.name,
        content: el.content,
        hover: el.hover || null,
        aria: el.aria || null,
        style: el.style ? {...el.style, id: undefined} : null,
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
      style: section.style ? {...section.style, id: undefined} : null,
      elements: merged.map(({order, type, ...rest}) => rest),
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
    where: {id: webpageId},
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
      webpage: {connect: {id: webpageId}},
      editor: {connect: {id: editorId}},
      verifier: {connect: {id: webpage.verifierId}},
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
export const getProposedVersionByWebpageIdService = async (webpageId) => {
  return await prismaClient.proposedVersion.findFirst({
    where: {webpageId},
    orderBy: {
      createdAt: "desc", // This will get the most recent version
    },
  });
};
export const deleteProposedVersionService = async (id) => {
  return await prismaClient.proposedVersion.delete({
    where: {id},
  });
};
