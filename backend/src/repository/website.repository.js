import prismaClient from "../config/dbConfig.js";
import {formatResourceVersionData} from "./content.repository.js";

export const fetchContentForWebsite = async (
  slug,
  isItemFullContent = true
) => {
  // Fetch the resource with all necessary relations
  const resource = await prismaClient.resource.findUnique({
    where: {
      slug: slug,
    },
    include: {
      liveVersion: {
        select: {
          ...(isItemFullContent
            ? {
                id: true,
                versionNumber: true,
                content: true,
                icon: true,
                Image: true,
                notes: true,
                referenceDoc: true,
                updatedAt: true,
                versionStatus: true,
              }
            : {
                id: true,
                icon: true,
                Image: true,
              }),
          sections: {
            include: {
              sectionVersion: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      // newVersionEditMode: {
      //   select: {
      //     id: true,
      //     versionNumber: true,
      //     content: true,
      //     icon: true,
      //     Image: true,
      //     notes: true,
      //     referenceDoc: true,
      //     updatedAt: true,
      //     versionStatus: true,
      //     sections: {
      //       include: {
      //         sectionVersion: true,
      //       },
      //       orderBy: {
      //         order: "asc",
      //       },
      //     },
      //   },
      // },
    },
  });

  if (!resource) {
    return null;
  }

  // Check if the resource is editable
  let isEditable = true;

  if (isItemFullContent) {
    // Find all requests for this resource
    const requests = await prismaClient.resourceVersioningRequest.findMany({
      where: {
        resourceVersion: {
          resourceId: resource.id,
        },
      },
      include: {
        approvals: {
          select: {
            status: true,
          },
        },
        resourceVersion: {
          select: {
            versionStatus: true,
          },
        },
      },
    });

    // Check if there's any active request in verification process with pending approvals
    const hasActiveVerificationRequest = requests.some(
      (request) =>
        // Check if the request is in verification process
        (request.status === "VERIFICATION_PENDING" ||
          request.status === "PUBLISH_PENDING") &&
        // And has no rejections
        !request.approvals.some((approval) => approval.status === "REJECTED") &&
        // And the version is not published or scheduled
        request.resourceVersion.versionStatus !== "PUBLISHED" &&
        request.resourceVersion.versionStatus !== "SCHEDULED"
    );

    // Resource is NOT editable if there's an active verification request with no rejections
    isEditable = !hasActiveVerificationRequest;
  }

  // Process both live version and edit version
  const result = {
    id: resource.id,
    titleEn: resource.titleEn,
    titleAr: resource.titleAr,
    slug: resource.slug,
    isEditable: isEditable,
    ...(isItemFullContent && {
      resourceType: resource.resourceType,
      resourceTag: resource.resourceTag,
      relationType: resource.relationType,
    }),
  };

  // Process live version if it exists
  if (resource.liveVersion) {
    result.liveModeVersionData = await formatResourceVersionData(
      resource.liveVersion,
      isItemFullContent,
      resource.slug,
      resource.resourceType,
      resource.resourceTag
    );
  }

  // // Process edit version if it exists
  // if (isItemFullContent && resource.newVersionEditMode) {
  //   result.editModeVersionData = await formatResourceVersionData(
  //     resource.newVersionEditMode,
  //     isItemFullContent,
  //     resource.slug
  //   );
  // }

  return result;
};
