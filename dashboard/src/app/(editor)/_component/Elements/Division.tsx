import React, { useEffect, useRef, useState, useCallback } from "react";
import { BaseElement } from "../../_functionality/createElement";
import { useMyContext } from "@/Context/EditorContext";
import { convertVWVHtoPxParentClamped } from "@/utils/convertVWVHtoParent";

type DivisionProps = {
    element: BaseElement;
    editable?: boolean;
    style: React.CSSProperties;
    updateContent: (id: string, property: string, value: any) => void;
    updateElement: (id: string, updatedElement: BaseElement) => void;
    rmElement: (id: string) => void;
    parentRef: HTMLElement | null;
};

const Division = ({
    element,
    editable = true,
    style,
    updateContent,
    updateElement,
    rmElement,
    parentRef
}: DivisionProps) => {
    const elementRef = useRef<HTMLDivElement | null>(null);
    const [divStyle, setDivStyle] = useState<React.CSSProperties>(style);
    const { contextElement, toolbarRef, contextForSection, activeScreen, screenStyleObj
        , setSectionChildElements,
        setSectionChildElementsSetterFull
    } = useMyContext();
    const [isEditing, setEditing] = useState<boolean>(false);

    const isAbsolute = divStyle.position === "absolute";
    const dragData = useRef<{ offsetX: number; offsetY: number } | null>(null);

    const activateTheEditing = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditing(true);
        contextForSection.setRmSection(() => () => rmElement(element.id));
        contextForSection.setCurrentSection(divStyle);
        contextForSection.setCurrentSectionSetter(() => setDivStyle);
        contextForSection.setSectionRef(elementRef);
        screenStyleObj.setScreenStyle(element.style)

        setSectionChildElements(null)
        setSectionChildElementsSetterFull(null)
    };

    // click outside
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
    }, [toolbarRef]);

    // Sync style changes
    useEffect(() => {
        if (isEditing) {
            contextElement.setElement(divStyle);
        }
        contextForSection.setCurrentSection(divStyle);
        updateElement(element.id, {
            ...element,
            style: { ...element.style, [activeScreen]: divStyle },
        });
    }, [divStyle]);

    // Sync content changes
    useEffect(() => {
        updateContent(element.id, "content", "null");
    }, [divStyle.content]);

    // ---- DRAG HANDLERS (outside of useEffect) ----
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!dragData.current || !elementRef.current?.parentElement) return;

            const { offsetX, offsetY } = dragData.current;
            const parentRect = elementRef.current.parentElement.getBoundingClientRect();

            // New position in px relative to parent
            const newLeftPx = e.clientX - parentRect.left - offsetX;
            const newTopPx = e.clientY - parentRect.top - offsetY;

            // Convert to % relative to parent
            const leftPercent = (newLeftPx / parentRect.width) * 100;
            const topPercent = (newTopPx / parentRect.height) * 100;

            setDivStyle((prev) => ({
                ...prev,
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
            }));
        },
        []
    );


    const handleMouseUp = useCallback(() => {
        dragData.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }, [handleMouseMove]);

    const handleMouseDown = useCallback(
        (e: MouseEvent) => {
            if (!isAbsolute || !elementRef.current) return;

            let left = parseFloat(divStyle.left?.toString() || "NaN");
            let top = parseFloat(divStyle.top?.toString() || "NaN");

            const parentRect = elementRef.current.parentElement?.getBoundingClientRect();
            if (!parentRect) return;

            // If left/top are not set yet, calculate from DOM
            if (isNaN(left) || isNaN(top)) {
                const rect = elementRef.current.getBoundingClientRect();
                left = ((rect.left - parentRect.left) / parentRect.width) * 100;
                top = ((rect.top - parentRect.top) / parentRect.height) * 100;

                setDivStyle((prev) => ({
                    ...prev,
                    left: `${left}%`,
                    top: `${top}%`,
                }));
            }

            dragData.current = {
                offsetX: e.clientX - (parentRect.left + (left / 100) * parentRect.width),
                offsetY: e.clientY - (parentRect.top + (top / 100) * parentRect.height),
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        },
        [isAbsolute, divStyle.left, divStyle.top, handleMouseMove, handleMouseUp]
    );



    useEffect(() => {
        const el = elementRef.current;
        if (!el) return;
        el.addEventListener("mousedown", handleMouseDown);
        return () => el.removeEventListener("mousedown", handleMouseDown);
    }, [handleMouseDown]);

    useEffect(() => {
        setDivStyle(style)
    }, [activeScreen])

    const runningWidth = activeScreen !== "xl";
    const runningStyle = runningWidth ? convertVWVHtoPxParentClamped(divStyle || {}, parentRef) : divStyle

    return (
        <div
            style={{
                ...runningStyle,

            }}
            id={element.id}
            ref={elementRef}
            onClick={activateTheEditing}
            onDoubleClick={(e) => e.stopPropagation()}
        />
    );
};

export default React.memo(Division);
