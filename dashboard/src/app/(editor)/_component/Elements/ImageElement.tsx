"use client";

import { useEffect, useRef, useState } from "react";
import ImageStyleToolbar from "../common/ImageToolbar";
import { useMyContext } from "@/Context/EditorContext";

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
  rmElement: (id: string) => void
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const { setImageContext, setImageEdit, contextRef } = useMyContext();
  const [thisElement, setThisElement] = useState<ElementType>(element);

  // For drag
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const elementStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setPreviewSrc(result);
        setThisElement((prev: ElementType): ElementType => ({
          ...prev,
          content: result
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current && imageRef.current.contains(e.target as Node)) {
      return;
    }

    if (clickTimer.current) return;
    clickTimer.current = setTimeout(() => {
      setToolbarIsOpen((prev) => !prev);
      clickTimer.current = null;
    }, 250);
  };

  const handleImageClick = () => {
    contextRef.setReference(imageRef.current);

    setImageContext({
      element: thisElement,
      setElement: setThisElement,
      style: thisElement.style,
      currentWidth: activeScreen,
      imageRef,
      onClose: () => setToolbarIsOpen(false),
    });
    setImageEdit(true);
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    setToolbarIsOpen((prev) => !prev);
  };

  // ==== Drag Handlers ====
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (
      !editable ||
      !["relative", "absolute"].includes(
        thisElement.style?.[activeScreen]?.position ?? ""
      )
    ) {
      return;
    }


    e.preventDefault();
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    const currentLeft = parseFloat(
      thisElement.style?.[activeScreen]?.left as string
    ) || 0;
    const currentTop = parseFloat(
      thisElement.style?.[activeScreen]?.top as string
    ) || 0;

    elementStartPos.current = { x: currentLeft, y: currentTop };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

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
    if (!isDragging.current) return;
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
  }, [thisElement.style]);

  return (
    <div
      style={{ position: thisElement.style?.[activeScreen]?.position, display: "inline-block" }}
      onClick={handleContainerClick}
      onDoubleClick={handleDoubleClick}
    >
      {editable && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      )}

      <img
        src={previewSrc || undefined}
        alt={element.alt || "Selected Image"}
        ref={imageRef}
        onClick={handleImageClick}
        onMouseDown={handleMouseDown} // DRAG INITIATOR
        style={{
          maxWidth: "100%",
          cursor:
            editable && thisElement.style?.[activeScreen]?.position === "relative"
              ? "move"
              : editable
                ? "pointer"
                : "default",
          ...thisElement.style?.[activeScreen],
          position: "relative",
        }}
      />
    </div>
  );
};

export default ImageElemComponent;
