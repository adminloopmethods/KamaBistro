import { useRef, useEffect, useState } from "react";
import Section from "./elements/Section";
import RichTextToolBar from "./tools/RichtextToolbar";
import { useMyContext } from "../Context/ContextApi";
import AddSection from "./tools/AddSection";
import { CreateSection } from "../Functionality/createSection";
import DimensionToolbar from "./tools/DimensionToolbar";
import StyleToolbar from "./tools/StyleToolbar";

const Webpage = () => {
    const containerRef = useRef(null);
    const [saveData, setUpdateData] = useState(false)

    const { // states from contextAPI
        width,
        websiteContent,
        contextRef,
        currentWidth,
        elementSetter,
        finalSubmit
    } = useMyContext() // custom function for calling the contextAPI

    const sectionStyleSetter = elementSetter ? elementSetter() : function () { } // elementSetter is a function inside state that initiates with null but once a section is active for changes than it recieve a setter function related to the section. purpose to make change to the active section only

    const saveAllSection = () => {
        if (Array.isArray(finalSubmit)) {
            finalSubmit.forEach((e) => {
                e.submit()
            })
        }
    }

    // Function to classify width
    const classifyWidth = (w) => {
        if (w > 1024) return "xl";
        if (w >= 768) return "lg";
        if (w >= 425) return "md";
        if (w <= 425) return "sm";
    };

    const addSection = (section = "section") => { // as named, to add a section
        websiteContent.setContent(prev => [...prev, CreateSection['section']()])
    }

    const rmSection = (sectionId) => { // remove an existing element
        setElements(prev => {
            const newSet = prev.filter((element, i) => {
                return element.id !== sectionId
            })
            return newSet
        })
    }

    const updateSectionStyles = (newStyle) => {
        sectionStyleSetter(prev => {
            return { ...prev, ...newStyle }
        })
    }

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const newWidth = entry.contentRect.width;
                width.setWidth(classifyWidth(newWidth))
                console.log(`Width: ${newWidth}, Size: ${classifyWidth(newWidth)}`);
            }
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect(); // Cleanup
    }, []);

    useEffect(() => {
        async function updateData() {
            const bodyPayload = {
                name: "website-1",
                content: websiteContent.content,
            }

            if (saveData) {
                bodyPayload.id = websiteContent
            }
            try {
                const response = await fetch("http://localhost:9000/content", {
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
                console.log("Successfully sent content:", data);
            } catch (error) {
                console.error("Failed to send content:", error);
            }
        }

        if (saveData) {
            updateData();
        }
    }, [websiteContent.content]);


    return (
        <div ref={containerRef} style={{ position: "relative", display: "flex", height: "100vh" }}>
            <h1 className="text-[40px] text-stone-500">Webpage</h1>
            {/* website */}
            <div style={{ position: "relative", flex: "1", overflowY: "scroll" }} className="scroll-one">

                {websiteContent.content.map((section, i, a) => { // section: {style:{xl:{},lg:{},md:{},sm:{}}, elements:[], id:"", name:"" }
                    console.log(section)
                    const lastSection = i === (a.length - 1)

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
                    )
                })}
                <AddSection controller={addSection} />
            </div>

            {/* You can render the size label for debugging */}
            <div style={{ minWidth: "240px", backgroundColor: "#393E46", height: "100%", overflowY: "scroll" }} className="scroll-one">

                {/* save every button */}
                <button style={{
                    backgroundColor: "#007bff",
                    border: "none",
                    padding: "10px",
                    borderRadius: "2px",
                    color: "white",
                    width: "100%",
                    position: "sticky",
                    top: "0px",
                    zIndex: "1"
                }}
                    onClick={(e) => { e.stopPropagation(); saveAllSection(); setUpdateData(true) }}>
                    Save Changes
                </button>
                {/* toolbars */}
                {
                    (!contextRef.activeRef)
                        ?
                        (<>
                            <DimensionToolbar updateStyles={updateSectionStyles} />
                            <StyleToolbar updateStyles={updateSectionStyles} rmSection={rmSection} />
                        </>)
                        :
                        <RichTextToolBar />
                }
            </div>
        </div>
    );
};

export default Webpage;
