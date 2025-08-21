"use client";

import React, { useRef, useEffect, useState, CSSProperties } from "react";
import { useMyContext, webpageType } from "@/Context/EditorContext";
import { useParams } from "next/navigation";
import { createContentReq, getLocationsReq, getWebpageReq, saveContentReq } from "@/functionality/fetch";
import { toastWithUpdate } from "@/functionality/ToastWithUpdate";
import Section from "../../_component/Elements/Section";
import { CreateSection, SectionElementType } from "../../_functionality/createSection";
import AddSection from "../../_component/common/AddSection";
import RichTextToolBar from "../../_component/common/RichTextToolbar";
import StyleToolbar from "../../_component/common/StyleToolbar";
import DimensionToolbar from "../../_component/common/DimensionToolbar";
import ImageStyleToolbar from "../../_component/common/ImageToolbar";
// import { testObj } from "@/assets/test"

import { CiMobile1 } from "react-icons/ci";
import { IoIosTabletPortrait } from "react-icons/io";
import { CiLaptop } from "react-icons/ci";
import { CiDesktop } from "react-icons/ci";
import { toast, Toaster } from "sonner";
import { LocationType } from "@/app/(dashboard)/users/CreateNewUser";
import CustomSelect from "@/app/_common/CustomSelect";
import { preSection } from "@/assets/preSection.js"
import { useDraggable } from "../../_component/common/useDraggable";

const renderInput = (
    label: string,
    key: string,
    type: 'text' | 'number' = 'text',
    suffix = '',
    value: string | undefined,
    onChange: (name: string, val: string) => void
) => {
    return (
        <div className="flex flex-col gap-1" key={key}>
            {/* <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label> */}
            <input
                type={type}
                value={value || ""}
                onChange={(e) => {
                    const val = e.target.value;
                    onChange(key, val)
                }}
                placeholder={label}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
            />
        </div>
    )
};

const Editor = () => {
    const params = useParams()
    const containerRef = useRef<HTMLDivElement | null>(null);
    const page = params.slug ? params.slug[0] : "" // hold the id from param to bring the content from backend
    const [saveData, setSaveData] = useState<Boolean>(false); // decides whether to allow save
    const [pageWidth, setPageWidth] = useState<number | string>("100%") // decides the width/screen of the page
    const [locations, setLocations] = useState<LocationType[]>([{ id: "", name: "" }])
    const [currentWidth, setCurrentWidth] = useState<string>("")

    const toolbarRef = useDraggable()

    const {
        width, // {currentWidth, setCurrentWidth}
        websiteContent, // website object that has {name, id, route, createdAt, updatedAt, content: []} // where content is each section
        contextRef, // if active then it toggle between the toolbar of text and section
        imageEdit, // boolean value to switch between the rich text tool and image toolbar
        activeScreen, // the active Screen
        currentSectionSetter, // setter of the setter to set the section style
        finalSubmit, // the array of the all section
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

    ///////////// screen related functionality ///////////////////
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

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const newWidth = entry.contentRect.width;
                width.setWidthValue(classifyWidth(newWidth) === "xl" ? `${newWidth}px` : "1280px")
                setCurrentWidth(classifyWidth(newWidth) === "xl" ? `${newWidth}px` : "1280px")
                width.setActiveScreen(classifyWidth(newWidth));
            }
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);
    //////////////////////////////////////////////////////////////////

    const addSection = (section = "section") => {
        setWebpage((prev: webpageType | null) => {
            if (!prev) return null
            return ({
                ...prev,
                contents: [
                    ...prev.contents,
                    CreateSection["section"]()
                ]
            })
        });
    };

    const setGivenName = (id: string, name: string) => {
        setWebpage((prev: webpageType | null) => {
            if (!prev) return null
            const newArray = prev.contents.map((e: any) => {
                if (e.id === id) {
                    return { ...e, givenName: name }
                } else {
                    return e
                }
            })
            return { ...prev, contents: newArray }
        })
    }

    const rmSection = (sectionId: string) => {
        setWebpage((prev: webpageType | null) => {
            if (!prev) return null
            const newSet = prev.contents.filter((element: any) => element.id !== sectionId);
            return { ...prev, contents: newSet };
        });
    };

    const updateSectionStyles = (newStyle: CSSProperties) => {
        sectionStyleSetter((prev: CSSProperties) => {
            return { ...prev, ...newStyle };
        });
    };

    const finalUpdate = (id: string, element: SectionElementType, lastSection?: Boolean) => {
        setWebpage((prev: webpageType | null) => {
            if (!prev) return null
            const newContent = prev.contents?.map((e: SectionElementType) => {
                if (e.id === id) return element
                else return e
            })
            return {
                ...prev,
                contents: newContent
            }
        })

        if (lastSection) setSaveData(false)
    }
    /////////////////////////////////////////Effects//////////////////////////////////////////
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await getLocationsReq();

                if (response.ok && Array.isArray(response?.location)) {
                    setLocations(response?.location);
                } else {
                    toast.error("Failed to load locations");
                }
            } catch (error) {
                toast.error("Error fetching locations");
            }
        };
        fetchLocations();
    }, []);
    useEffect(() => {
        async function updateData() {
            const bodyPayload: Record<string, any> = { ...webpage };
            // console.log(JSON.stringify(bodyPayload))
            if (!bodyPayload.name) return toast.error("Webpage name is required");
            if (!bodyPayload.route) return toast.error("Webpage route is required");
            if (!bodyPayload.locationId) return toast.error("Location ID is required");

            try {
                const response = await toastWithUpdate(() => page ? saveContentReq(page, bodyPayload) : createContentReq(bodyPayload), {
                    loading: page ? "Updating content..." : "Saving Content...",
                    success: "Successful saved the content!",
                    error: (err: any) => err?.message || "Failed to create the content",
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
            setSaveData(false)
        }
    }, [saveData]);

    useEffect(() => {
        if (page) {
            const id: string = page;
            async function getContentfromServer(): Promise<void> {
                try {
                    const response: any = await getWebpageReq(id) // bringing the content from backend 

                    if (response.ok) { // if successfull
                        setWebpage(response.webpage) // then store in the contextApi. The object structure is similar to related else block
                        // setWebpage({
                        //     id: crypto.randomUUID(),
                        //     route: testObj.route,
                        //     locationId: testObj.locationId,
                        //     name: testObj.name,
                        //     contents: testObj.contents,
                        //     createdAt: "",
                        //     updatedAt: "",
                        //     editedWidth: currentWidth ? currentWidth : "1280px"
                        // })
                    } else {
                        throw new Error("error while fetch the page")
                    }
                } catch (err) {
                    console.error(err)
                }
            }

            getContentfromServer()
        } else { // if the page is not there then create from  fresh
            setWebpage({
                id: crypto.randomUUID(),
                route: "",
                locationId: "",
                name: "",
                contents: preSection.contents,
                createdAt: "",
                updatedAt: "",
                editedWidth: currentWidth ? currentWidth : "1280px"
            })
        }
    }, [page])

    const setMetaOfPage = (name: string, value: string) => {
        setWebpage((prev: webpageType | null) => {
            if (!prev) return {
                id: crypto.randomUUID(),
                route: "",
                locationId: "",
                name: "",
                contents: [],
                createdAt: "",
                updatedAt: "",
                editedWidth: currentWidth ? currentWidth : "1280px",
                [name]: value
            }

            return { ...prev, [name]: value }
        });
    }

    return (
        <div style={{ position: "relative", display: "flex", height: "100vh" }}>
            {/* website */}
            <div className="scroll-one bg-zinc-800" style={{ position: "relative", flex: 1, overflowY: "scroll", overflowX: "hidden" }}>

                <div
                    ref={containerRef}
                    style={{
                        position: "relative",
                        flex: 1,
                        width: pageWidth,
                        margin: "0 auto",
                        minHeight: "100vh",
                        transition: ".1s linear all",
                        backgroundColor: "#e7e5e4", // stone-200
                        backgroundImage: `
                                          linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                                          linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                                        `,
                        backgroundSize: "15px 15px", // size of grid squares
                    }}
                    className="bg-stone-200"
                >
                    {webpage?.contents?.map((section: any, i: number, a: any[]) => {
                        const lastSection = i === a.length - 1;

                        return (
                            <Section
                                key={i}
                                element={section.elements}
                                section={section}
                                style={section.style[activeScreen]}
                                rmSection={rmSection}
                                onEditing={() => {
                                    contextRef.setContextRef(null);
                                }}
                                updateData={saveData}
                                setUpdateData={setSaveData}
                                finalUpdate={finalUpdate}
                                lastSection={lastSection}
                                createSection={CreateSection}
                                setGivenName={setGivenName}
                            />
                        );
                    })}
                    <AddSection controller={addSection} />
                </div>


            </div>
            {/* Sidebar/toolbars */}
            <div
                style={{ width: "250px", backgroundColor: "#393E46", height: "100%", overflowY: "scroll", zIndex: 1000 }}
                className="scroll-one fixed top-0 right-0"
                ref={toolbarRef}
            >
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
                    onClick={(e) => { e.stopPropagation(); saveAllSection(); setSaveData(true); }}
                >
                    Save Changes
                </button>
                <div className="bg-[#1C352D] text-white text-2xl p-1 py-4 flex justify-evenly">
                    <button onClick={() => applyXLScreen()} className={`${styleForScreenIcons} ${activeScreen === "xl" && "bg-stone-500"}`}><CiDesktop /></button>
                    <button onClick={() => applyLGScreen()} className={`${styleForScreenIcons} ${activeScreen === "lg" && "bg-stone-500"}`}><CiLaptop /></button>
                    <button onClick={() => applyMDScreen()} className={`${styleForScreenIcons} ${activeScreen === "md" && "bg-stone-500"}`}><IoIosTabletPortrait /></button>
                    <button onClick={() => applySMScreen()} className={`${styleForScreenIcons} ${activeScreen === "sm" && "bg-stone-500"}`}><CiMobile1 /></button>
                </div>

                <div className="p-2 w-[240px] px-4 flex gap-5 flex-col my-4">
                    {renderInput("Name", "name", "text", "", webpage?.name, setMetaOfPage)}
                    {renderInput("Route", "route", "text", "", webpage?.route, setMetaOfPage)}
                    <CustomSelect
                        options={locations?.map(e => ({ label: e.name, value: e.id })) || []}
                        firstOption="Set Location"
                        disableFirstValue={true}
                        onChange={(value) => {
                            setWebpage((prev: webpageType | null) => {
                                if (!prev) return null
                                return {
                                    ...prev, locationId: value
                                }
                            })
                        }}
                    />
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
            <Toaster position="top-right" />
        </div >
    );
};

export default Editor;

const styleForScreenIcons = "p-2 hover:bg-stone-500 cursor-pointer rounded-sm"