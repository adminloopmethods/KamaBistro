"use client";

import { useMyContext } from "@/Context/EditorContext";
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
    updateContent: (id: string, key: string, value: any) => void;
    updateElement: (id: string, updatedElement: ElementType) => void;
    rmElement?: (id: string) => void;
};

const Paragraph = ({
    element,
    editable = true,
    updateContent,
    style,
    updateElement,
    rmElement
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

    const handleBlur = () => {
        if (elementRef.current) {
            const value = elementRef.current.innerHTML;
            setContent(value);
            updateContent(element.id, "content", value);
        }
    };

    const activateTheEditing = () => {
        setEditing(true);
        contextElement.setElementSetter(() => () => setThisElement);
        contextElement.setElement(thisElement);
        if (elementRef.current) {
            elementRef.current.style.outline = "1px solid black";
        }
        contextRef.setReference(elementRef.current);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                toolbarRef.current &&
                !toolbarRef.current.contains(e.target as Node) &&
                elementRef.current &&
                !elementRef.current.contains(e.target as Node)
            ) {
                if (elementRef.current) {
                    elementRef.current.style.outline = "none";
                }
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [toolbarRef]);

    useEffect(() => {
        if (isEditing) {
            contextElement.setElement(thisElement);
        }
        updateElement(element.id, thisElement);
    }, [thisElement.style]);

    return (
        <p
            id={element.id}
            ref={elementRef}
            onBlur={handleBlur}
            contentEditable={editable}
            suppressContentEditableWarning={true}
            style={style}
            onFocus={activateTheEditing}
        />
    );
};

export default Paragraph;
