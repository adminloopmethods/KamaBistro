"use client";

import React, { useEffect, useRef, useState, ChangeEvent, MouseEvent } from "react";
import { Upload, X } from "lucide-react";
import { cloudinaryApiPoint } from "@/utils/endpoints";
import { Toaster, toast } from "sonner";
import Popups from "@/app/_common/PopUps";
import { useImageUpload } from "../../_functionality/useImageUpload";
import { deleteMedia, fetchAllImages } from "@/functionality/fetch";
import capitalizeWords from "../../_functionality/commons";

type ImageType = {
    id: string;
    url: string;
    type: string;
    width: number;
    height: number;
    altText: string;
    publicId: string;
    createdAt: string;
    resourceId: string;
};

type AltTextType = {
    en: string;
    ar: string;
};

interface ImageSelectorProps {
    onSelectImage: (fileInfo: string[] | string, altText?: AltTextType) => void;
    onClose: () => void;
    type?: "IMAGE" | "DOCUMENT";
}

const imageStructure: ImageType[] = [
    {
        id: "",
        url: "",
        type: "",
        width: NaN,
        height: NaN,
        altText: "",
        publicId: "",
        createdAt: "",
        resourceId: ""
    }
];

const ImageSelector: React.FC<ImageSelectorProps> = ({ // props are here
    onSelectImage,
    onClose,
    type = "IMAGE"
}) => {
    const [resourceId, setResourceId] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<{
        name: string;
        size: string;
        width: number;
        height: number;
        uploadedAt: string;
    } | null>(null);

    const [uploading, setUploading] = useState(false);
    const [uploadCancel] = useState(false); // You had but never used cancel
    const [imagesByResource, setImagesByResources] = useState(true);
    const [images, setImages] = useState<ImageType[]>(imageStructure);
    const [loadingImages, setLoadingImages] = useState(false);
    const [deleteImgId, setDeleteImgId] = useState("");
    const [popup, setPopup] = useState(false);
    const [random, setRandom] = useState(Math.random());
    const [altText, setAltText] = useState<AltTextType>({ en: "", ar: "" });

    const documentMode = type === "DOCUMENT";

    const { uploadImage } = useImageUpload(resourceId, type);

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        if (!files.length || uploading) return;

        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length) {
            toast.error("One or more files exceed the 5MB size limit.");
            return;
        }

        setUploading(true);

        try {
            await uploadImage(files.length > 1 ? files : files[0]);
            setRandom(Math.random());
            toast.success(
                files.length > 1
                    ? "All files uploaded successfully"
                    : "File uploaded successfully",
            );
        } catch (err) {
            console.error("Error uploading files:", err);
            toast.error(String(err));
        } finally {
            setUploading(false);
        }
    };

    const handleAltText = (e: ChangeEvent<HTMLInputElement>) => {
        setAltText(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageSelect = (src: string, index: number) => {
        if (uploading) return;
        if (documentMode) {
            setSelectedFile(src);
        } else {
            const img = new Image();
            img.onload = () => {
                setSelectedFile(src);
                setMetadata({
                    name: `Image ${index + 1}`,
                    size: "Unknown",
                    width: img.width,
                    height: img.height,
                    uploadedAt: "Remote Image"
                });
            };
            img.src = src;
        }
    };

    const handleImageDelete = async () => {
        try {
            const response = await deleteMedia(deleteImgId);
            if (response.ok) {
                toast.success("Image has been deleted Successfully.");
                setRandom(Math.random());
                onSelectImage([""]);
            } else {
                throw new Error("Failed to delete image");
            }
        } catch (err) {
            console.error(err);
            toast.error(String(err));
        }
    };

    const clearSelectedImage = () => {
        setSelectedFile(null);
        setMetadata(null);
    };

    useEffect(() => {
        async function getAllImagesHandler() {
            if (
                // !imagesByResource ||
                //  (imagesByResource && resourceId)
                true
            ) {
                setLoadingImages(true);
                try {
                    const payload = imagesByResource
                        ? { resourceId, mediaType: type }
                        : { mediaType: type };

                    const response = await fetchAllImages(payload || "");
                    if (response.ok) {
                        setImages(response.media);
                    } else {
                        throw new Error("Error while fetching images");
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoadingImages(false);
                }
            }
            console.log("ewqrq")
        }
        getAllImagesHandler();
    }, [imagesByResource, random, resourceId, type]);

    useEffect(() => {
        setResourceId(localStorage.getItem("contextId") || "");
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent | globalThis.MouseEvent) => {
            if (
                modalRef.current &&
                event.target instanceof Node &&
                !modalRef.current.contains(event.target)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/70 bg-opacity-10 flex items-center justify-center z-[1001]">
            {/* Main Modal */}
            <div
                ref={modalRef}
                className="bg-white p-6 rounded-lg max-w-[90%] h-[80vh] overflow-hidden w-full relative dark:bg-[#242933]"
            >
                <h2 className="text-[20px] font-[500] dark:text-stone-300">
                    Select or Upload an {capitalizeWords(type)}
                </h2>

                <div className="flex h-[80%] gap-2 mt-4 items-stretch">
                    {/* Image Grid */}
                    <div
                        className={`${documentMode ? "flex-[4_1_400px]" : "flex-[5_1_1200px]"
                            } self-stretch h-full flex flex-col`}
                    >
                        {!documentMode && (
                            <ul className="flex">
                                <li
                                    onClick={() => setImagesByResources(true)}
                                    className={`dark:text-stone-200 text-stone-50 px-2 text-sm py-1 rounded-[2px] ${imagesByResource
                                        ? "dark:bg-blue-800 bg-blue-500"
                                        : "bg-stone-300 dark:bg-stone-500"
                                        }`}
                                >
                                    This Page only
                                </li>
                                <li
                                    onClick={() => setImagesByResources(false)}
                                    className={`dark:text-stone-200 text-stone-50 px-2 text-sm py-1 rounded-[2px] ${!imagesByResource
                                        ? "dark:bg-blue-800 bg-blue-500"
                                        : "bg-stone-300 dark:bg-stone-500"
                                        }`}
                                >
                                    All Images
                                </li>
                            </ul>
                        )}
                        <div
                            className={`${documentMode
                                ? "flex-col gap-[0px]"
                                : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                                } overflow-y-scroll flex-[1] customscroller p-5 border border-stone-500/20`}
                        >
                            {loadingImages ? (
                                <div className="col-span-full flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                                    <span className="ml-4 text-gray-600 dark:text-stone-300">
                                        Loading images...
                                    </span>
                                </div>
                            ) : (
                                images.map((imgObj, idx) => {
                                    const even = idx % 2 === 0;
                                    const imgSrc = `${cloudinaryApiPoint}/${imgObj.publicId}`;
                                    return (
                                        <div
                                            key={idx}
                                            className={`w-full ${documentMode ? "" : "h-40"
                                                } relative overflow-hidden rounded cursor-pointer border-2 ${selectedFile === imgSrc
                                                    ? "border-blue-500"
                                                    : "border-transparent"
                                                }`}
                                        >
                                            {documentMode ? (
                                                <div
                                                    className={`relative p-2 ${even ? "bg-stone-600/30" : ""
                                                        }`}
                                                    onClick={() => handleImageSelect(imgSrc, idx)}
                                                >
                                                    <p>{imgObj.publicId}</p>
                                                </div>
                                            ) : (
                                                <img
                                                    src={imgSrc}
                                                    alt={`Image ${idx}`}
                                                    className={`w-full h-full object-fill ${selectedFile === imgSrc && "brightness-[0.6]"
                                                        }`}
                                                    draggable={false}
                                                    onClick={() => handleImageSelect(imgSrc, idx)}
                                                />
                                            )}
                                            {imagesByResource && (
                                                <button
                                                    className={`absolute z-[40] ${documentMode
                                                        ? "top-1/2 -translate-y-1/2"
                                                        : "top-2"
                                                        } right-2 bg-[#80808080] text-white rounded-full p-1`}
                                                    onClick={() => {
                                                        setDeleteImgId(imgObj.id);
                                                        setPopup(true);
                                                    }}
                                                >
                                                    <X width={16} height={16} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div
                        className={`flex-[3_0_auto] flex flex-col bg-[#F3F3F3] p-4 rounded w-1/3 dark:bg-[#242941] ${documentMode ? "" : "mt-[25px]"
                            }`}
                    >
                        <h3 className="font-semibold mb-2">Attachment Details</h3>
                        {uploading ? (
                            <div className="flex justify-center items-center w-full h-full">
                                <div className="spinner-border animate-spin border-4 border-blue-500 rounded-full w-12 h-12" />
                                <p className="text-gray-500 ml-4">Uploading...</p>
                            </div>
                        ) : selectedFile ? (
                            <div className="flex flex-col flex-[1]">
                                {documentMode ? (
                                    <div className="border h-full order-[1]">
                                        <iframe
                                            src={selectedFile + "#toolbar=0&navpanes=0&scrollbar=0"}
                                            className="w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full relative flex gap-2 border-b-2 pb-4">
                                        <div className="h-[20vh] w-[18vw] relative border">
                                            <img
                                                src={selectedFile}
                                                alt="Selected"
                                                className="w-full h-full object-contain rounded cursor-pointer"
                                                draggable={false}
                                            />
                                            <button
                                                title="Click to clear"
                                                className="absolute top-[2px] right-2 bg-[#808080a8] text-white rounded-full p-1"
                                                onClick={clearSelectedImage}
                                            >
                                                <X width={16} height={16} />
                                            </button>
                                        </div>
                                        <div className="mt-2 text-[10px] space-y-1 w-1/3">
                                            <p>
                                                <strong>{metadata?.name}</strong>
                                            </p>
                                            <p>{metadata?.size}</p>
                                            <p>
                                                {metadata?.width} × {metadata?.height}
                                            </p>
                                            <p>{metadata?.uploadedAt}</p>
                                        </div>
                                    </div>
                                )}
                                {!documentMode && (
                                    <div className="flex flex-col gap-4 mt-4">
                                        <label
                                            htmlFor="altEn"
                                            className="flex sm:flex-col xl:flex-row text-sm justify-between xl:items-center"
                                        >
                                            Alt Text
                                            <input
                                                onChange={handleAltText}
                                                type="text"
                                                name="en"
                                                id="altEn"
                                                className="rounded-sm p-2 text-xs xl:w-[15vw] sm:w-full"
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">No File selected</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-4 items-center mt-6">
                    <div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                            disabled={uploading}
                        >
                            <Upload className="w-4 h-4" /> Upload {capitalizeWords(type)}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={
                                type === "IMAGE"
                                    ? "image/*"
                                    : documentMode
                                        ? ".pdf"
                                        : "image/*,video/*"
                            }
                            className="hidden"
                            onChange={handleFileUpload}
                            multiple
                        />
                    </div>
                    <div className="flex gap-4">
                        {selectedFile && !uploading && (
                            <button
                                onClick={() =>
                                    onSelectImage(selectedFile.split("/").slice(-1), altText)
                                }
                                className="bg-blue-800 text-white px-4 py-2 rounded shadow text-[15px]"
                            >
                                Select
                            </button>
                        )}
                    </div>
                </div>

                {/* Close Button */}
                <button
                    className="absolute top-4 right-6 text-gray-500 text-xl"
                    onClick={onClose}
                >
                    ✕
                </button>
                <Popups
                    display={popup}
                    setClose={() => setPopup(false)}
                    confirmationText={"Are you sure you want to delete this file?"}
                    confirmationFunction={handleImageDelete}
                />
            </div>
            {/* <Toaster /> */}
        </div>
    );
};

export default React.memo(ImageSelector);
