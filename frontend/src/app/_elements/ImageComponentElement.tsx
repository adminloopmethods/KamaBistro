import { useRef } from "react";
import image from "@/assets/placeholderImage.png"
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

const ImageElemComponent: React.FC<ImageComponentProps> = ({
    element,
    editable = true,
    currentWidth = "xl",
}) => {
    const imageRef = useRef<HTMLImageElement | null>(null);

    function normalizeImagePath(path: string): string {
        // If the path starts with "@/assets/", convert it to "/assets/"
        if (path.startsWith("@/assets/")) {
            return path.replace("@/assets/", "/assets/");
        }
        // Otherwise, return as-is or handle other cases
        return path;
    }


    return (
        <div
            style={{
                position: element.style?.[currentWidth]?.position,
                // display: "inline-block",
                top: element.style?.[currentWidth]?.top,
                left: element.style?.[currentWidth]?.left,
                width: element.style?.[currentWidth]?.width,
                paddingTop: element.style?.[currentWidth]?.paddingTop,
                paddingBottom: element.style?.[currentWidth]?.paddingBottom,
                paddingLeft: element.style?.[currentWidth]?.paddingLeft,
                paddingRight: element.style?.[currentWidth]?.paddingRight
            }}
        >
            <img
                src={
                    // normalizeImagePath(element.content)
                    cloudinaryApiPoint + element.content
                }
                alt={element.alt || "Selected"}
                ref={imageRef}
                style={{
                    ...element?.style?.[currentWidth],
                    top: 0,
                    left: 0,
                    position: "relative",
                    backgroundColor: "transparent",
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,

                }}
            />
        </div>
    );
};

export default ImageElemComponent;
