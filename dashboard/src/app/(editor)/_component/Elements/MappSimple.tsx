"use client";

import React, { useEffect, useRef, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { googleApi } from "@/utils/endpoints";
import { BaseElement } from "../../_functionality/createElement";
import { useMyContext } from "@/Context/EditorContext";
import { convertVWVHtoPxParentClamped } from "@/utils/convertVWVHtoParent";

const DEFAULT_CENTER = { lat: 41.8130, lng: -87.8690 }; // LA GRANGE

type DivisionProps = {
    element: BaseElement;
    editable?: boolean;
    style: React.CSSProperties;
    updateContent: (id: string, property: string, value: any) => void;
    updateElement: (id: string, updatedElement: BaseElement) => void;
    rmElement: (id: string) => void;
    parentRef: HTMLElement | null;
};

const SingleLocationMap: React.FC<DivisionProps> = ({ element, editable, style, updateContent, updateElement, rmElement, parentRef }) => {
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



    useEffect(() => {
        setDivStyle(style)
    }, [activeScreen])

    const runningWidth = activeScreen !== "xl";
    const runningStyle = runningWidth ? convertVWVHtoPxParentClamped(divStyle || {}, parentRef) : divStyle

    return (
        <div style={{ ...runningStyle }} onClick={activateTheEditing}>
            <div className="w-[100%] h-[100%]" style={{ pointerEvents: "none" }}>
                <APIProvider apiKey={googleApi || ""}>
                    <Map
                        defaultCenter={DEFAULT_CENTER}
                        defaultZoom={15}
                        style={{ minWidth: "100px", minHeight: "100px", borderRadius: "12px" }}
                    >
                        <Marker position={DEFAULT_CENTER} title="LA GRANGE, 9 South La Grange Road IL 60525" />
                    </Map>
                </APIProvider>
            </div>
        </div>

    );
}

export default SingleLocationMap