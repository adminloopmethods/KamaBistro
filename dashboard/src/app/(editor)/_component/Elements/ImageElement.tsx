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
  const [thisElement, setThisElement] = useState<ElementType>(element)


  const setElement = (newElementOrUpdater: React.SetStateAction<ElementType>) => {
    if (typeof newElementOrUpdater === "function") {
      const newElement = (newElementOrUpdater as (prev: ElementType) => ElementType)(element);
      updateElement(element.id, newElement);
    } else {
      updateElement(element.id, newElementOrUpdater);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setPreviewSrc(result);
        updateContent(element.id, "content", result);
        setThisElement((prev: ElementType): ElementType => {
          return {
            ...prev,
            content: result
          }
        })
      }
    };
    reader.readAsDataURL(file);
  };

  // Click handler for the image to open file input
  const handleDoubleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation(); // Stop bubbling to container
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  // Container click toggles toolbar, but ignore if click came from image
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current && imageRef.current.contains(e.target as Node)) {
      // Click inside image, ignore toggling toolbar
      return;
    }

    console.log(thisElement)
    setImageContext({
      element: thisElement,
      setElement: setThisElement,
      style: element.style,
      currentWidth: activeScreen,
      imageRef,
      onClose: () => setToolbarIsOpen(false),
    });
    setImageEdit(true);

    if (clickTimer.current) return;
    clickTimer.current = setTimeout(() => {
      setToolbarIsOpen((prev) => !prev);
      clickTimer.current = null;
    }, 250);
  };

  const handleImageClick = () => {
    contextRef.setReference(imageRef.current)
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    setToolbarIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!toolbarIsOpen) return;
      if (!(e.target instanceof HTMLElement)) return;

      if (
        imageRef.current?.contains(e.target)
        // Add toolbarRef?.current?.contains(e.target) check if you have toolbar ref
      )
        return;

      setToolbarIsOpen(false);
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [toolbarIsOpen]);

  useEffect(() => {
    updateContent(element.id, "content", thisElement.content);
    setPreviewSrc(thisElement.content || "");
    setImageContext({
      element: thisElement,
      setElement: setThisElement,
      style: element.style,
      currentWidth: activeScreen,
      imageRef,
      onClose: () => setToolbarIsOpen(false),
    });
  }, [thisElement.content])

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
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
        onClick={handleImageClick} // open file input only on image click
        style={{
          maxWidth: "100%",
          cursor: editable ? "pointer" : "default",
          ...element.style?.[activeScreen],
        }}
      />
    </div>
  );
};


export default ImageElemComponent;
