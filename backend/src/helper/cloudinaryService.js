// services/cloudinaryService.js
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadFileToCloudinary = async (filePath, fileName = null) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: fileName || `file_${Date.now()}`,
    });

    console.log("Cloudinary upload successful:", {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });

    // Remove the temporary file
    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
};

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    console.log(
      `Deleting image with public_id: ${publicId} from Cloudinary...`
    );

    const result = await cloudinary.uploader.destroy(publicId);

    console.log("Cloudinary delete successful:", result);

    return result;
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    throw error;
  }
};
