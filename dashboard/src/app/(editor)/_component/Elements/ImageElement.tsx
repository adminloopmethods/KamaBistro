"use client";

import { useEffect, useRef, useState } from "react";
import { useMyContext } from "@/Context/EditorContext";
import ImageSelector from "../common/ImageSelector";
import { cloudinaryApiPoint } from "@/utils/endpoints";

interface StyleObject {
  [key: string]: React.CSSProperties;
}

interface ElementType {
  id: string;
  name: string;
  content: string; // image src
  style: StyleObject;
  alt?: string;
}

interface ImageComponentProps {
  element: ElementType;
  editable?: boolean;
  updateElement: (id: string, updatedElement: ElementType) => void;
  updateContent: (id: string, property: string, value: any) => void;
  activeScreen?: string; // like "xl" or "md"
  style: React.CSSProperties;
  rmElement: (id?: string) => void;
}

const ImageElemComponent: React.FC<ImageComponentProps> = ({
  element,
  editable = true,
  updateElement,
  updateContent,
  activeScreen = "xl",
  style,
  rmElement
}) => {
  const [toolbarIsOpen, setToolbarIsOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(element.content || "");
  const imageRef = useRef<HTMLImageElement | null>(null);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const { setImageContext, setImageEdit, contextRef } = useMyContext();
  const [thisElement, setThisElement] = useState<ElementType>(element);

  // For ImageSelector modal
  const [showImageSelector, setShowImageSelector] = useState(false);

  // For drag
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const elementStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);



  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (clickTimer.current) return;
    clickTimer.current = setTimeout(() => {
      setToolbarIsOpen((prev) => !prev);
      clickTimer.current = null;
    }, 250);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    contextRef.setReference(imageRef.current);
    setImageContext({
      element: thisElement,
      setElement: setThisElement,
      style: thisElement.style,
      currentWidth: activeScreen,
      imageRef,
      onClose: () => setToolbarIsOpen(false),
      rmElement: () => rmElement(element.id)
    });
    setImageEdit(true);
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    setToolbarIsOpen((prev) => !prev);
  };

  // ==== Drag Handlers ====
  // ==== Drag Handlers ====
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (
      !editable ||
      (
        // thisElement.style?.[activeScreen]?.position !== "relative" &&
        thisElement.style?.[activeScreen]?.position !== "absolute")
    ) {
      return;
    }
    e.preventDefault();

    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    const currentLeft =
      parseFloat(thisElement.style?.[activeScreen]?.left as string) || 0;
    const currentTop =
      parseFloat(thisElement.style?.[activeScreen]?.top as string) || 0;
    elementStartPos.current = { x: currentLeft, y: currentTop };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    // Update React state directly (no direct DOM updates)
    setThisElement((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        [activeScreen]: {
          ...prev.style?.[activeScreen],
          left: elementStartPos.current.x + dx + "px",
          top: elementStartPos.current.y + dy + "px",
        },
      },
    }));
  };


  const handleMouseUp = () => {
    if (!isDragging.current || !imageRef.current) return;

    const finalLeft = imageRef.current.style.left;
    const finalTop = imageRef.current.style.top;

    setThisElement((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        [activeScreen]: {
          ...prev.style?.[activeScreen],
          left: finalLeft,
          top: finalTop,
        },
      },
    }));

    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };


  // ==== Effects ====
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!toolbarIsOpen) return;
      if (!(e.target instanceof HTMLElement)) return;
      if (imageRef.current?.contains(e.target)) return;
      setToolbarIsOpen(false);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [toolbarIsOpen]);

  useEffect(() => {
    updateContent(element.id, "content", thisElement.content);
    setPreviewSrc(thisElement.content || "");
  }, [thisElement.content]);

  useEffect(() => {
    setImageContext((prev) => ({
      ...prev,
      element: thisElement,
      style: thisElement.style,
    }));
    updateElement(element.id, thisElement);
  }, [thisElement.style]);

  const cursorCondition =
    // thisElement.style?.[activeScreen]?.position === "relative" ||
    thisElement.style?.[activeScreen]?.position === "absolute";

  const onImageSelect = (fileInfo: any, altText: any) => {
    const src =
      typeof fileInfo === "string"
        ? fileInfo
        : fileInfo.join("");
    setThisElement((prev) => ({
      ...prev,
      content: `/${src}`,
      alt: altText?.en || prev.alt,
    }));
    setShowImageSelector(false);
    setImageContext((prev) => ({ ...prev, openSelector: false }))
  }

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (editable) {
      setImageContext((prev) => {
        return {
          ...prev,
          setSrcFn: onImageSelect,
          openSelector: true
        }
      }); // open selector instead of file picker
    }
  };

  return (
    <>

      <img
        id={element.id}
        ref={imageRef}
        onMouseDown={handleMouseDown} // DRAG INITIATOR
        src={(cloudinaryApiPoint + previewSrc) || undefined}
        alt={element.alt || "Selected Image"}
        onClick={handleImageClick}
        onDoubleClick={handleDoubleClick}
        style={{
          ...thisElement.style?.[activeScreen],
          cursor:
            editable && cursorCondition
              ? "move"
              : editable
                ? "pointer"
                : "default",
          backgroundColor: "transparent",
        }}

      />
    </>
  );
};

export default ImageElemComponent;
