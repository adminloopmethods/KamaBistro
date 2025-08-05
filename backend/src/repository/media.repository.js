import prismaClient from "../config/dbConfig.js";

export const createMedia = async (
  url,
  publicId,
  type,
  width = null,
  height = null,
  altText = null,
  resourceId
) => {
  return await prismaClient.media.create({
    data: {
      url,
      publicId,
      type,
      width,
      height,
      altText,
      resourceId,
    },
  });
};


export const fetchMedia = async (resourceId, mediaType, search, pageNum = 1, limitNum = 10) => {
  const skip = (pageNum - 1) * limitNum;
  const isNum = !isNaN(Number(search));

  return await prismaClient.media.findMany({
    where: {
      ...(resourceId && { resourceId }),
      ...(mediaType && { type: mediaType }),
      ...(search && {
        OR: [
          { url: { contains: search, mode: 'insensitive' } },
          { altText: { path: ['en'], string_contains: search, string_mode: 'insensitive' } },
          { altText: { path: ['ar'], string_contains: search, string_mode: 'insensitive' } },
          ...(isNum ? [{ width: Number(search) }, { height: Number(search) }] : []),
        ],
      }),
    },
    skip,
    take: limitNum,
    orderBy: { createdAt: 'desc' },
  });
};




export const findMediaById = async (id) => {
  return await prismaClient.media.findUnique({
    where: { id },
  });
};

export const deleteMediaById = async (id) => {
  return await prismaClient.media.delete({
    where: { id },
  });
};

