'use client';

import React, { useRef, useEffect, useState, FocusEvent } from "react";
import Link from "next/link";
import { BaseElement, LinkElement } from "@/app/(editor)/_functionality/createElement";
import { useMyContext } from "@/Context/EditorContext";
import { convertVWVHtoPxParentClamped } from "@/utils/convertVWVHtoParent";

type LinkProps = {
    element: LinkElement;
    editable?: boolean;
    style?: React.CSSProperties;
    updateContent: (id: string, property: string, value: any) => void;
    updateElement: (id: string, updatedElement: BaseElement) => void;
    rmElement: (id: string) => void;
    parentRef: HTMLElement | null;

};

const LinkComponent: React.FC<LinkProps> = ({
    element,
    editable = true,
    style,
    updateContent,
    updateElement,
    rmElement,
    parentRef
}) => {
    const elementRef = useRef<HTMLAnchorElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const [thisElement, setThisElement] = useState<LinkElement>(element);
    const { contextRef, contextElement, toolbarRef, screenStyleObj, activeScreen } = useMyContext();
    const [isEditing, setEditing] = useState<boolean>(false);

    const href = thisElement.href

    console.log(href)

    // Set text from element.content
    useEffect(() => {
        if (elementRef.current && (element.content || element.content === "")) {
            elementRef.current.innerHTML = element.content;
        }
    }, [element.content]);

    const activateTheEditing = (e: any) => {
        e.preventDefault(); // stop real navigation
        e.stopPropagation();

        setEditing(true);
        contextElement.setElementSetter(() => setThisElement);
        contextElement.setElement(thisElement);
        contextElement?.setRmElementFunc(() => () => rmElement(element.id));
        if (elementRef.current) {
            elementRef.current.style.outline = "1px dashed black";
        }
        contextRef.setReference(elementRef.current);
        screenStyleObj.setScreenStyle(thisElement.style)

    };

    const handleBlur = (e: FocusEvent<HTMLAnchorElement>) => {
        const value = elementRef.current?.innerHTML ?? "";
        setThisElement((prev: LinkElement) => ({
            ...prev,
            content: value.trim(),
        }));
    };

    // Close editor when clicking outside (but not inside panel)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!elementRef.current) return;

            const clickedToolbar = toolbarRef.current?.contains(e.target as Node) ?? false;
            const clickedElement = elementRef.current?.contains(e.target as Node) ?? false;
            const clickedPanel = panelRef.current?.contains(e.target as Node) ?? false;

            if (!clickedToolbar && !clickedElement && !clickedPanel) {
                elementRef.current.style.outline = "";
                setEditing(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [toolbarRef, elementRef]);

    // Sync style changes
    useEffect(() => {
        if (isEditing) {
            contextElement.setElement(thisElement);
        }
        updateElement(element.id, thisElement);
    }, [thisElement.style]);

    // Sync content
    useEffect(() => {
        updateContent(element.id, "content", thisElement.content);
    }, [thisElement.content]);

    // Sync href + ariaLabel
    useEffect(() => {
        updateContent(element.id, "href", thisElement.href);
        updateContent(element.id, "aria", thisElement.aria);
    }, [thisElement.href, thisElement.aria]);

    // Check if link is external
    const isExternal = thisElement.href?.startsWith("http");

    const runningWidth = activeScreen !== "xl";
    const runningStyle = runningWidth ? convertVWVHtoPxParentClamped(style || {}, parentRef) : style

    return (
        <div style={{ position: "relative", zIndex: 2 }}>
            {isExternal ? (
                <a
                    href={thisElement.href || "#"}
                    aria-label={thisElement.aria || ""}
                    title={thisElement.aria}
                    id={element.id}
                    ref={elementRef}
                    onClick={activateTheEditing}
                    onBlur={handleBlur}
                    contentEditable={editable}
                    suppressContentEditableWarning={true}
                    style={{ ...runningStyle }}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {thisElement.content || "Link Text"}
                </a>
            ) : (
                <Link
                    href={thisElement.href || "#"}
                    aria-label={thisElement.aria || ""}
                    title={thisElement.aria}
                    id={element.id}
                    ref={elementRef}
                    onClick={activateTheEditing}
                    onBlur={handleBlur}
                    contentEditable={editable}
                    suppressContentEditableWarning={true}
                    style={runningStyle}
                >
                    {thisElement.content || "Link Text"}
                </Link>
            )}

            {isEditing && elementRef.current && (
                <div
                    ref={panelRef}
                    style={{
                        position: "fixed", // relative to viewport
                        top:
                            elementRef.current.getBoundingClientRect().bottom + 10 >
                                window.innerHeight - 200
                                ? elementRef.current.getBoundingClientRect().top - 200 - 10 // open above if bottom overflows
                                : elementRef.current.getBoundingClientRect().bottom + 10, // otherwise below
                        left: Math.min(
                            elementRef.current.getBoundingClientRect().left,
                            window.innerWidth - 320 // keep within screen width
                        ),
                        zIndex: 9999,
                        width: "300px",
                    }}
                    className="space-y-3 p-3 rounded-xl text-[black] border border-gray-200 bg-gray-50 shadow-sm"
                >
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Link URL (href)
                        </label>
                        <input
                            type="text"
                            placeholder="https://example.com"
                            value={href || ""}
                            onChange={(e) =>
                                setThisElement((prev) => ({ ...prev, href: e.target.value }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm 
                                focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Aria Label
                        </label>
                        <textarea
                            placeholder="Describe the purpose of this link"
                            value={thisElement.aria || ""}
                            onChange={(e) =>
                                setThisElement((prev) => ({ ...prev, aria: e.target.value }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm 
                                focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none transition resize-none"
                            rows={2}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(LinkComponent);
