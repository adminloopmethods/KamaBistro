"use client";

import React, { useRef, useEffect, useState } from "react";
import { useMyContext } from "@/Context/EditorContext";
import { useParams } from "next/navigation";
import { createContentReq, getWebpageReq, saveContentReq } from "@/functionality/fetch";
import { toastWithUpdate } from "@/functionality/ToastWithUpdate";
import Section from "../../_component/Elements/Section";
import { CreateSection } from "../../_functionality/createSection";
import AddSection from "../../_component/common/AddSection";
import RichTextToolBar from "../../_component/common/RichTextToolbar";
import StyleToolbar from "../../_component/common/StyleToolbar";
import DimensionToolbar from "../../_component/common/DimensionToolbar";
import ImageStyleToolbar from "../../_component/common/ImageToolbar";

import { CiMobile1 } from "react-icons/ci";
// import { MdOutlineTabletMac } from "react-icons/md";
import { IoIosTabletPortrait } from "react-icons/io";
import { CiLaptop } from "react-icons/ci";
import { CiDesktop } from "react-icons/ci";



const Editor = () => {
    const params = useParams()
    const containerRef = useRef<HTMLDivElement | null>(null);
    const page = params.slug ? params.slug[0] : ""
    const [saveData, setUpdateData] = useState<Boolean>(false);
    const [pageWidth, setPageWidth] = useState<number | string>("100%")

    const {
        width,
        websiteContent,
        contextRef,
        currentWidth,
        currentSectionSetter,
        finalSubmit,
        imageEdit
    } = useMyContext();

    const { webpage, setWebpage } = websiteContent;

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

    const applySMScreen = () => {
        setPageWidth("424px")
    }

    const applyMDScreen = () => {
        setPageWidth("600px")
    }

    const applyLGScreen = () => {
        setPageWidth("1024px")
    }

    const applyXLScreen = () => {
        setPageWidth("100%")
    }

    const addSection = (section = "section") => {
        setWebpage((prev: any) => ({ ...prev, contents: [...prev.content, CreateSection["section"]()] }));
    };

    const rmSection = (sectionId: string) => {
        setWebpage((prev: any) => {
            const newSet = prev.contents.filter((element: any) => element.id !== sectionId);
            return { ...prev, contents: newSet };
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
            const bodyPayload: Record<string, any> = { ...webpage };


            // if (saveData) {
            //     bodyPayload.id = websiteContent;
            // }

            try {
                const response = await toastWithUpdate(() => page ? saveContentReq(bodyPayload) : createContentReq(bodyPayload), {
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
    }, [saveData]);

    useEffect(() => {
        if (page) {
            const id: string = page;
            async function getContentfromServer(): Promise<void> {
                try {
                    const response: any = await getWebpageReq(id)

                    if (response.ok) {
                        setWebpage(response.webpage)
                    } else {
                        throw new Error("error while fetch the page")
                    }
                } catch (err) {
                    console.error(err)
                }
            }

            getContentfromServer()
        } else {
            setWebpage({
                id: "",
                name: "",
                contents: [],
                createdAt: "",
                updatedAt: "",
                route: "",
                locationId: ""
            })
        }
    }, [page])
    console.log(pageWidth)
    console.log(width.currentWidth)

    return (
        <div style={{ position: "relative", display: "flex", height: "100vh" }}>
            {/* website */}
            <div className="scroll-one bg-zinc-800" style={{ position: "relative", flex: 1, overflowY: "scroll", }}>

                <div ref={containerRef} style={{ position: "relative", flex: 1, width: pageWidth, margin: "0 auto" }} className="">
                    {webpage?.contents?.map((section: any, i: number, a: any[]) => {
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
                <div className="bg-[#1C352D] text-white text-2xl p-1 py-4 flex justify-evenly">
                    <button onClick={() => applySMScreen()} className="p-2 hover:bg-stone-500 cursor-pointer"><CiMobile1 /></button>
                    <button onClick={() => applyMDScreen()} className="p-2 hover:bg-stone-500 cursor-pointer"><IoIosTabletPortrait /></button>
                    <button onClick={() => applyLGScreen()} className="p-2 hover:bg-stone-500 cursor-pointer"><CiLaptop /></button>
                    <button onClick={() => applyXLScreen()} className="p-2 hover:bg-stone-500 cursor-pointer"><CiDesktop /></button>
                </div>
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
