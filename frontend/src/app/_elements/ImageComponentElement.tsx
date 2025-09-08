import { useRef } from "react";
import { cloudinaryApiPoint } from "@/utils/endpoints";

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
  currentWidth?: string;
}

/**
 * Calculate image dimensions and aspect ratio
 * @param width number | string (e.g., 640 or "640px")
 * @param height number | string (e.g., 360 or "360px")
 * @returns { width: number, height: number, aspectRatio: string }
 */
function getImageDimensions(
  width?: number | string,
  height?: number | string
): { width?: number; height?: number; aspectRatio?: string } {
  const w = width ? parseFloat(width as string) : undefined;
  const h = height ? parseFloat(height as string) : undefined;

  if (w && h) {
    return {
      width: w,
      height: h,
      aspectRatio: `${w} / ${h}`, // CSS-compatible aspect ratio
    };
  }

  if (w && !h) return { width: w };
  if (!w && h) return { height: h };

  return {};
}

const ImageElemComponent: React.FC<ImageComponentProps> = ({
  element,
  editable = true,
  currentWidth = "xl",
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const { width: imgWidth, height: imgHeight, aspectRatio } = getImageDimensions(
    element?.style?.[currentWidth]?.width,
    element?.style?.[currentWidth]?.height
  );

  return (
    <div
      style={{
        position: element.style?.[currentWidth]?.position,
        top: element.style?.[currentWidth]?.top,
        left: element.style?.[currentWidth]?.left,
        width: element.style?.[currentWidth]?.width,
        paddingTop: element.style?.[currentWidth]?.paddingTop,
        paddingBottom: element.style?.[currentWidth]?.paddingBottom,
        paddingLeft: element.style?.[currentWidth]?.paddingLeft,
        paddingRight: element.style?.[currentWidth]?.paddingRight,
      }}
    >
      <img
        src={cloudinaryApiPoint + element.content}
        alt={element.alt || "Selected"}
        ref={imageRef}
        style={{
          ...element?.style?.[currentWidth],
          aspectRatio, // prevents CLS
          position: "relative",
          backgroundColor: "transparent",
          top: 0,
          left: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }}
        width={imgWidth}
        height={imgHeight}
      />
    </div>
  );
};

export default ImageElemComponent;
