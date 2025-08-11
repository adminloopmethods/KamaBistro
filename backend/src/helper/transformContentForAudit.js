import prismaClient from "../config/dbConfig.js";

// Helper to get section name by ID
async function getSectionName(sectionId) {
  if (!sectionId || typeof sectionId !== 'string') {
    console.warn(`Invalid sectionId: ${sectionId}`);
    return `Unknown Section (${sectionId})`;
  }
  try {
    const section = await prismaClient.section.findUnique({
      where: { id: sectionId },
      select: { title: true },
    });
    if (!section) {
      console.warn(`Section not found for id: ${sectionId}`);
      return `Unknown Section (${sectionId})`;
    }
    return section.title || sectionId;
  } catch (err) {
    console.error(`Prisma error for sectionId ${sectionId}:`, err.message);
    return `Unknown Section (${sectionId})`;
  }
}

// Helper to get resource name by ID
async function getResourceName(resourceId) {
  const resource = await prismaClient.resource.findUnique({
    where: { id: resourceId },
    select: { titleEn: true },
  });
  return resource?.titleEn || resourceId;
}

// Recursively transform a section
async function transformSection(section) {
  const sectionName = await getSectionName(section.sectionId);
  const formattedSection = {
    section: sectionName,
    order: section.order,
    content: section.content,
  };
  // Items
  if (section.items) {
    formattedSection.items = await Promise.all(
      section.items.map(async (item) => ({
        order: item.order,
        name: await getResourceName(item.id),
        resourceType: item.resourceType,
      }))
    );
  }
  // Nested sections
  if (section.sections) {
    formattedSection.sections = await Promise.all(
      section.sections.map(transformSection)
    );
  }
  return formattedSection;
}

// Main transform function
export default async function transformContentForAudit(input) {

  console.log(input,"transform///////////////////////////////////////////")
  // Accepts either a resource version object or updateContent payload
  const version = input.newVersionEditMode || input.editModeVersionData || input.liveModeVersionData;
  const formattedContent = {
    resource: input.titleEn || input.content?.titleEn,
    resourceId: input.resourceId || input.content?.id,
    slug: input.slug || input.content?.slug,
    newVersionEditMode: {
      comments: version.comments,
      referenceDoc: version.referenceDoc,
      content: version.content,
      icon: version.icon,
      image: version.image,
      sections: version.sections ? await Promise.all(version.sections.map(transformSection)) : [],
    },
  };
  // Optionally add request details if present
  if (input.request) {
    formattedContent.request = {
      sender: input.request.sender?.name || null,
      approvals: Array.isArray(input.request.approvals)
        ? input.request.approvals.map(a => ({
            name: a.approver?.name || null,
            stage: a.stage,
            status: a.status,
            comment : a.comments
          }))
        : [],
    };
  }
  return formattedContent;
} 