
"use client";

import { useRef, useEffect, useState } from "react";
import Section from "../../_component/Elements/Section";
import { useMyContext } from "@/Context/EditorContext";
import { CreateSection } from "../../_functionality/createSection";
import AddSection from "../../_component/common/AddSection";
import RichTextToolBar from "../../_component/common/RichTextToolbar";
import StyleToolbar from "../../_component/common/StyleToolbar";
import DimensionToolbar from "../../_component/common/DimensionToolbar";
import { usePathname } from "next/navigation";
import { createContentReq, getWebpageReq, saveContentReq } from "@/functionality/fetch";
import { toastWithUpdate } from "@/functionality/ToastWithUpdate";
import ImageStyleToolbar from "../../_component/common/ImageToolbar";
import { useParams } from "next/navigation";

const Editor = () => {
    const params = useParams()
    console.log(params)
    const containerRef = useRef<HTMLDivElement | null>(null);
    const nav = usePathname()
    const navigationArray = nav.split("/")
    const page = navigationArray[2]
    const isPage = navigationArray.length >= 3
    const [saveData, setUpdateData] = useState<Boolean>(false);

    const {
        width,
        websiteContent,
        contextRef,
        currentWidth,
        currentSectionSetter,
        finalSubmit,
        imageEdit
    } = useMyContext();


    const sectionStyleSetter = currentSectionSetter ? currentSectionSetter : () => { };

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
        return "sm";
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
            }
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        async function updateData() {
            const bodyPayload: Record<string, any> = {
                name: "website-10",
                content: websiteContent.content,
                route: "/a"
            };


            // if (saveData) {
            //     bodyPayload.id = websiteContent;
            // }

            try {
                const response = await toastWithUpdate(() => isPage ? saveContentReq(bodyPayload) : createContentReq(bodyPayload), {
                    loading: "Logging in...",
                    success: "Login Successful!",
                    error: (err: any) => err?.message || "Login failed",
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log("Successfully sent content:", response);
            } catch (error) {
            }
        }

        if (saveData) {
            updateData();
        }
    }, [websiteContent.content]);

    useEffect(() => {
        if (page) {
            async function getContentfromServer() {
                try {
                    const response: any = await getWebpageReq(page)

                    if (response.ok) {
                        websiteContent.setContent(response)
                    } else {
                        throw new Error("error while fetch the page")
                    }
                } catch (err) {
                    console.error(err)
                }
            }

            getContentfromServer()
        }
    }, [page])

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
                        imageEdit ?
                            <ImageStyleToolbar />
                            : <RichTextToolBar />
                    )
                }
            </div>
        </div>
    );
};

export default Editor;
