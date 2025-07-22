import { useRef, useEffect, useState } from "react";
// import { useMyContext } from "../Context/ContextApi";
import Section from "./Section/Section";
import { useMyContext } from "../Context/ContextAPI";

const Webpage = () => {
    const containerRef = useRef(null);

    const { // states from contextAPI
        width,
        websiteContent,
        contextRef,
        currentWidth,
    } = useMyContext() // custom function for calling the contextAPI


    // Function to classify width
    const classifyWidth = (w) => {
        if (w > 1024) return "xl";
        if (w >= 768) return "lg";
        if (w >= 425) return "md";
        if (w <= 425) return "sm";
    };


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
        async function getData() {
            try {
                const response = await fetch("http://localhost:9000/content/63a53498-88b6-48bf-b22d-b7101dd9c89e", {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Successfully content recieved:", data);
                websiteContent.setContent(data?.[0]?.contents || data?.contents)
            } catch (error) {
                console.error("Failed to send content:", error);
            }
        }

        getData();
    }, []);

    console.log(websiteContent.content)
    return (
        <div ref={containerRef} style={{ position: "relative", display: "flex", height: "100vh", width: "100vw", border: "1px solid black" }}>
            {/* website */}
            {/* <div style={{ position: "relative", flex: "1", overflowY: "scroll", border: "1px solid red" }} className="scroll-one"> */}

            {websiteContent.content.map((section, i, a) => { // section: {style:{xl:{},lg:{},md:{},sm:{}}, elements:[], id:"", name:"" }
                const lastSection = i === (a.length - 1)
                console.log(section)
                return (
                    <Section
                        key={i}
                        element={section.elements}
                        section={section}
                        style={section.style[currentWidth]}
                        lastSection={lastSection}
                    />
                )
            })}
            {/* </div> */}
        </div>
    );
};

export default Webpage;
