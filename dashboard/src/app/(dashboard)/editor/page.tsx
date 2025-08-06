
"use client";

import { useRef, useEffect, useState } from "react";
// import RichTextToolBar from "./Components/RichtextToolbar";
import DimensionToolbar from "./Components/DimensionToolbar";
import StyleToolbar from "./Components/StyleToolbar";
import Section from "./_component/Elements/Section";
import { useMyContext } from "@/Context/EditorContext";
import { CreateSection } from "./_functionality/createSection";
import AddSection from "./_component/common/AddSection";
import RichTextToolBar from "./_component/common/RichTextToolbar";

const Editor = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [saveData, setUpdateData] = useState(false);

    const {
        width,
        websiteContent,
        contextRef,
        currentWidth,
        elementSetter,
        finalSubmit
    } = useMyContext();

    const sectionStyleSetter = elementSetter ? elementSetter() : () => {};

    const saveAllSection = () => {
        if (Array.isArray(finalSubmit)) {
            finalSubmit.forEach((e) => {
                e.submit();
            });
        }
    };

    // Function to classify width
    const classifyWidth = (w: number) => {
        if (w > 1024) return "xl";
        if (w >= 768) return "lg";
        if (w >= 425) return "md";
        if (w <= 425) return "sm";
    };

    const addSection = (section = "section") => {
        websiteContent.setContent((prev: any) => [...prev, CreateSection["section"]()]);
    };

    const rmSection = (sectionId: string) => {
        websiteContent.setContent((prev: any) => {
            const newSet = prev.filter((element: any) => element.id !== sectionId);
            return newSet;
        });
    };

    const updateSectionStyles = (newStyle: any) => {
        sectionStyleSetter((prev: any) => {
            return { ...prev, ...newStyle };
        });
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const newWidth = entry.contentRect.width;
                width.setWidth(classifyWidth(newWidth));
                // console.log(`Width: ${newWidth}, Size: ${classifyWidth(newWidth)}`);
            }
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        async function updateData() {
            const bodyPayload: any = {
                name: "website-1",
                content: websiteContent.content,
            };

            if (saveData) {
                bodyPayload.id = websiteContent;
            }
            try {
                const response = await fetch("http://localhost:9000/content/", {
                    method: saveData ? "POST" : "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bodyPayload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                // console.log("Successfully sent content:", data);
            } catch (error) {
                // console.error("Failed to send content:", error);
            }
        }

        if (saveData) {
            updateData();
        }
    }, [websiteContent.content]);

    return (
        <div ref={containerRef} style={{ position: "relative", display: "flex", height: "100vh" }}>
            {/* website */}
            <div style={{ position: "relative", flex: 1, overflowY: "scroll" }} className="scroll-one">
                {websiteContent.content.map((section: any, i: number, a: any[]) => {
                    const lastSection = i === a.length - 1;
                    return (
                        <Section
                            key={i}
                            element={section.elements}
                            section={section}
                            style={section.style[currentWidth]}
                            rmSection={rmSection}
                            onEditing={() => {
                                contextRef.setContextRef(null);
                            }}
                            updateData={saveData}
                            setUpdateData={setUpdateData}
                            lastSection={lastSection}
                        />
                    );
                })}
                <AddSection controller={addSection} />
            </div>

            {/* Sidebar/toolbars */}
            <div style={{ minWidth: "240px", backgroundColor: "#393E46", height: "100%", overflowY: "scroll" }} className="scroll-one">
                <button
                    style={{
                        backgroundColor: "#007bff",
                        border: "none",
                        padding: "10px",
                        borderRadius: "2px",
                        color: "white",
                        width: "100%",
                        position: "sticky",
                        top: 0,
                        zIndex: 1
                    }}
                    onClick={(e) => { e.stopPropagation(); saveAllSection(); setUpdateData(true); }}
                >
                    Save Changes
                </button>
                {/* toolbars */}
                {
                    !contextRef.activeRef ? (
                        <>
                            <DimensionToolbar updateStyles={updateSectionStyles} />
                            <StyleToolbar updateStyles={updateSectionStyles} rmSection={rmSection} />
                        </>
                    ) : (
                        <RichTextToolBar />
                    )
                }
            </div>
        </div>
    );
};

export default Editor;
