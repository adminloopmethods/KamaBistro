import {
  uploadMedia,
  getMedia,
  deleteMedia,
} from "./media.service.js";

const UploadMedia = async (req, res) => {
  const uploadedMedia = req.uploadedImages;
  const { mediaType, resourceId } = req.body;
  const response = await uploadMedia(mediaType, resourceId, uploadedMedia);
  res.status(200).json(response);
};

const GetMedia = async (req, res) => {
  const {resourceId, mediaType, search, page, limit } = req.query;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 100;
  const response = await getMedia(
    resourceId,
    mediaType,
    search,
    pageNum,
    limitNum
  );
  res.status(200).json(response);
};

const DeleteMedia = async (req, res) => {
  const mediaId = req.params.id;
  const response = await deleteMedia(mediaId);
  res.status(200).json(response);
};

export default {
  UploadMedia,
  GetMedia,
  DeleteMedia,
};
