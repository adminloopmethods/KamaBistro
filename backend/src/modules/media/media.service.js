import { logger } from "../../config/index.js";
import { assert, assertEvery } from "../../errors/assertError.js";
import {
  createMedia,
  deleteMediaById,
  fetchMedia,
  findMediaById,
} from "../../repository/media.repository.js";
import { deleteImageFromCloudinary } from "../../helper/cloudinaryService.js";

const uploadMedia = async (mediaType, resourceId, uploadedMedia) => {
  console.log("Media upload request:", {
    mediaType,
    resourceId,
    uploadedMedia,
  });

  const createdMedia = await Promise.all(
    uploadedMedia.map(async (media) => {
      return await createMedia(
        media.public_id, // url
        media.public_id, // publicId
        mediaType, //  mediaType
        media.width, // width
        media.height, // height
        media.public_id, // altText
        resourceId, // resourceId
      );
    })
  );

  logger.info({
    message: "Media uploaded successfully",
    resourceId,
    mediaCount: createdMedia.length,
  });

  return {
    message: "Media uploaded successfully",
    media: createdMedia,
  };
};

const getMedia = async ( resourceId,
    mediaType,
    search,
    pageNum,
    limitNum) => {
  const media = await fetchMedia( resourceId,
    mediaType,
    search,
    pageNum,
    limitNum);
  return { message: "Media fetched successfully", media:media };
};

const deleteMedia = async (mediaId) => {
  const media = await findMediaById(mediaId);
  assert(media, "NOT_FOUND", "Media not found");

  // Delete from database
  await deleteMediaById(media.id);
  // Delete from Cloudinary
  await deleteImageFromCloudinary(media.publicId);
  logger.info({
    message: "Media deleted successfully",
    mediaId,
  });

  return { message: "Media deleted successfully" };
};

export { uploadMedia, getMedia, deleteMedia };
