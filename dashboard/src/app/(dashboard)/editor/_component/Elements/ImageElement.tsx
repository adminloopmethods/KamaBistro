import { useEffect, useRef, useState } from "react";
// import ImageStyleToolbar from "../../Components/ImageToolbar";

interface ElementType {
  id: string;
  name: string;
  content: string;
  style: Record<string, React.CSSProperties>;
  alt?: string;
}

interface ImageComponentProps {
  element: ElementType;
  editable?: boolean;
  updateElement: (element: ElementType) => void;
  updateContent: (element: ElementType) => void;
  currentWidth?: string;
}

const ImageElemComponent: React.FC<ImageComponentProps> = ({
  element,
  editable = true,
  updateElement,
  updateContent,
  currentWidth = "xl",
}) => {
  const [toolbarIsOpen, setToolbarIsOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(element?.content || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPreviewSrc(element?.content || "");
  }, [element?.content]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setPreviewSrc(result);
        updateContent({ ...element, content: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    if (clickTimer.current) return;

    clickTimer.current = setTimeout(() => {
      setToolbarIsOpen(true);
      clickTimer.current = null;
    }, 250);
  };

  const handleDoubleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    setToolbarIsOpen((prev) => !prev);
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onClick={handleClick}
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
        src={previewSrc}
        alt={element.alt || "Selected"}
        ref={imageRef}
        onClick={() => editable && fileInputRef.current?.click()}
        style={{
          maxWidth: "100%",
          cursor: editable ? "pointer" : "default",
          ...element?.style?.[currentWidth],
        }}
      />

      {/* {toolbarIsOpen && editable && (
        <ImageStyleToolbar
          element={element}
          updateElement={updateElement}
          currentWidth={currentWidth}
          imageRef={imageRef}
          onClose={() => setToolbarIsOpen(false)}
        />
      )} */}
    </div>
  );
};

export default ImageElemComponent;
