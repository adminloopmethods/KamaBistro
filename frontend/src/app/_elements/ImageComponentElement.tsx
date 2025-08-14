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

    // Usage
    // <img src={normalizeImagePath(element.content)} alt={element.alt || "Selected"} />


    return (
        <div
            style={{ position: "relative", display: "inline-block" }}
        >
            <img
                src={
                    // normalizeImagePath(element.content)
                   element.content
                }
                alt={element.alt || "Selected"}
                ref={imageRef}
                style={{
                    maxWidth: "100%",
                    cursor: editable ? "pointer" : "default",
                    ...element?.style?.[currentWidth],
                }}
            />
        </div>
    );
};

export default ImageElemComponent;
