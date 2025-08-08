import { useRef } from "react";

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

    return (
        <div
            style={{ position: "relative", display: "inline-block" }}
        >
            <img
                src={element?.content}
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
