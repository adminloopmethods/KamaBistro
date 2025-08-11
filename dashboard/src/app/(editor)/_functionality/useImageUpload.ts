// hooks/useImageUpload.ts
import { uploadMedia } from "@/functionality/fetch";
import { useState } from "react";

type MediaType = "VIDEO" | "IMAGE" | "DOCUMENT";

type UploadMediaResponse = Record<string, any>

interface UseImageUploadReturn {
    uploadImage: (files: File | File[] | null) => Promise<string | null>;
    uploading: boolean;
}

export function useImageUpload(resourceId: string, type: MediaType): UseImageUploadReturn {
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (files: File | File[] | null): Promise<string | null> => {
        if (!files) return null;

        const formData = new FormData();

        if (Array.isArray(files)) {
            for (const file of files) {
                formData.append("mediaFile", file);
            }
        } else {
            formData.append("mediaFile", files);
        }

        formData.append("mediaType", type);
        formData.append("resourceId", resourceId);

        try {
            setUploading(true);

            const response: UploadMediaResponse = await uploadMedia(formData);

            if (response.ok) {
                return response.imageUrl || URL.createObjectURL(Array.isArray(files) ? files[0] : files);
            } else {
                throw new Error(response.message || "Upload failed");
            }
        } catch (err) {
            if (err instanceof Error) {
                throw err;
            } else {
                throw new Error("Unknown error occurred during upload");
            }
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading };
}
