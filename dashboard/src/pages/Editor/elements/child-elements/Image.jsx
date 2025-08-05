import { useEffect, useRef, useState } from "react";
import ImageStyleToolbar from "../../Components/ImageToolbar"

const ImageComponent = ({
  element,
  editable = true,
  updateElement,
  updateContent,
  currentWidth = "xl",
}) => {
  const [toolbarIsOpen, setToolbarIsOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(element?.content || "");
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const clickTimer = useRef(null);

  // Load image preview when content changes
  useEffect(() => {
    setPreviewSrc(element?.content || "");
  }, [element?.content]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setPreviewSrc(result);
      updateContent({ ...element, content: result });
    };
    reader.readAsDataURL(file);
  };

  // Controlled click to prevent single+double clash
  const handleClick = () => {
    if (clickTimer.current) return; // ignore if timer is already running

    clickTimer.current = setTimeout(() => {
      setToolbarIsOpen(true); // open on single click only if not interrupted
      clickTimer.current = null;
    }, 250); // wait to see if a second click comes
  };

  const handleDoubleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    setToolbarIsOpen((prev) => !prev); // toggle toolbar on double click
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
        alt="Selected"
        ref={imageRef}
        onClick={() => editable && fileInputRef.current?.click()}
        style={{
          maxWidth: "100%",
          cursor: editable ? "pointer" : "default",
          ...element?.style?.[currentWidth],
        }}
      />

      {toolbarIsOpen && editable && (
        <ImageStyleToolbar
          element={element}
          updateElement={updateElement}
          currentWidth={currentWidth}
          imageRef={imageRef}
          onClose={() => setToolbarIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ImageComponent;
