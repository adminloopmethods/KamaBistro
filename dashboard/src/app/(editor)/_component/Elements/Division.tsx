import React, { FocusEvent, useEffect, useRef, useState } from "react";
import { BaseElement } from "../../_functionality/createElement";
import { useMyContext } from "@/Context/EditorContext";

type HeadingProps = {
    element: BaseElement;
    editable?: boolean;
    style: React.CSSProperties;
    updateContent: (id: string, property: string, value: any) => void;
    updateElement: (id: string, updatedElement: BaseElement) => void;
    rmElement: (id: string) => void;
};

const Division = ({
    element,
    editable = true,
    style,
    updateContent,
    updateElement,
    rmElement,
}: HeadingProps) => {

    const elementRef = useRef<HTMLHeadingElement | null>(null);
    const [divStyle, setDivStyle] = useState<React.CSSProperties>(style);
    const { contextElement, toolbarRef, contextForSection, activeScreen } = useMyContext();
    const [isEditing, setEditing] = useState<boolean>(false);

    // Set innerHTML when content updates
    // useEffect(() => {
    //     if (elementRef.current && (element.content || element.content === "")) {
    //         elementRef.current.innerHTML = element.content;
    //     }
    // }, [element.content]);

    const activateTheEditing = (e: any) => {
        e.stopPropagation()
        setEditing(true)
        contextForSection.setRmSection(() => () => rmElement(element.id))
        contextForSection.setCurrentSection(divStyle)
        contextForSection.setCurrentSectionSetter(() => setDivStyle)
        contextForSection.setSectionRef(elementRef)
    };

    // Remove outline if clicked outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!elementRef.current) return;

            const clickedToolbar =
                toolbarRef.current?.contains(e.target as Node) ?? false;
            const clickedElement =
                elementRef.current?.contains(e.target as Node) ?? false;

            if (!clickedToolbar && !clickedElement) {
                elementRef.current.style.outline = "none";
                setEditing(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [toolbarRef, elementRef]); // contextRef not needed


    // Sync style changes
    useEffect(() => {
        if (isEditing) {
            contextElement.setElement(divStyle);
        }
        contextForSection.setCurrentSection(divStyle)
        updateElement(element.id, { ...element, style: { ...element.style, [activeScreen]: divStyle } });
    }, [divStyle]);

    // Sync content changes
    useEffect(() => {
        updateContent(element.id, "content", "null");
    }, [divStyle.content]);

    return (
        <div
            style={style}
            id={element.id}
            ref={elementRef}
            onClick={activateTheEditing}
            onDoubleClick={(e: React.MouseEvent<HTMLHeadingElement>) => { e.stopPropagation() }}
        />
    )
}

export default React.memo(Division)