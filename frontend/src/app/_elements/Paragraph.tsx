"use client";

import { useMyContext } from "@/Context/ApiContext";
import { useRef, useEffect, useState, RefObject } from "react";

// Define prop types
type ElementType = {
    id: string;
    content: string;
    style?: React.CSSProperties;
    [key: string]: any; // For any extra properties
};

type ParagraphProps = {
    element: ElementType;
    editable?: boolean;
    style?: React.CSSProperties;
};

const Paragraph = ({
    element,
    editable = true,
    style,
}: ParagraphProps) => {
    const elementRef = useRef<HTMLParagraphElement | null>(null);
    const [content, setContent] = useState<string>("New Heading");
    const [thisElement, setThisElement] = useState<ElementType>(element);
    const { contextRef, contextElement, toolbarRef } = useMyContext();
    const [isEditing, setEditing] = useState<boolean>(false);

    useEffect(() => {
        if (elementRef.current && (element.content || element.content === "")) {
            elementRef.current.innerHTML = element.content || content;
        }
    }, [element.content]);

    return (
        <p
            id={element.id}
            ref={elementRef}
            suppressContentEditableWarning={true}
            style={{ ...style, position: style?.position === "absolute" ? "absolute" : "relative", zIndex: "2" }}
        />
    );
};

export default Paragraph;
