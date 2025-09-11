"use client";

import { useRef, useEffect, useState } from "react";
import Section from "@/app/_elements/Section";
import { useMyContext } from "@/Context/ApiContext";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getContentReq } from "@/functionalities/fetch";
import NotFound from "./not-found";
import Header from "@/app/_elements/LandinHeader";
import Footer from "@/app/_elements/LocationFooter";

const Editor = () => {
    const params = useParams()
    const containerRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter()
    const page: string = params.slug ? params.slug[0] : ""
    const [pageNotFound, setPageNotFound] = useState(false);

    // const [widthSize, setWidthSize] = useState<number>(0)
    const [locationObject, setLocationObject] = useState("")

    const {
        width,
        websiteContent,
        currentWidth,
    } = useMyContext();


    // Function to classify width
    const classifyWidth = (w: number) => {
        if (w > 1200) return "xl";
        if (w >= 1024) return "lg";
        if (w >= 600) return "md";
        return "sm";
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const newWidth = entry.contentRect.width;
                width.setWidthSize(newWidth)
                width.setWidth(classifyWidth(newWidth));
                // console.log(`Width: ${newWidth}, Size: ${classifyWidth(newWidth)}`);
            }
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // if (page) {
        async function getContentfromServer() {
            try {
                console.log(page)
                const response: any = await getContentReq(page, true)
                if (response.ok) {
                    console.log(JSON.stringify(response))
                    websiteContent.setWebpage(response.webpage)
                    width.setEditedWidth(response.webpage.editedWidth)
                } else {
                    setPageNotFound(true);
                    throw new Error("error while fetch the page")
                }
            } catch (err) {
                console.error(err)
            }
        }

        getContentfromServer()
        // }
    }, [page])

    if (pageNotFound) {
        return (
            <NotFound />
        );
    }
    return (
        <div
            ref={containerRef}
            style={{ display: "flex", height: "100vh", position: "relative", zIndex: 1 }}
            className=" "
        >
            {/* website */}
            <div className="scroll-one bg-zinc-800" style={{ flex: 1, }}>
                <Header />


                <div
                    ref={containerRef}
                    style={{
                        // position: "relative",
                        flex: 1,
                        // width: pageWidth,
                        margin: "0 auto",
                        minHeight: "100vh",
                        transition: ".1s linear all",
                        backgroundColor: "#e7e5e4", // stone-200
                        backgroundSize: "15px 15px", // size of grid squares
                        paddingTop: "100px"
                    }}
                    className="bg-stone-200 poppins-text"
                >
                    {websiteContent?.webpage?.contents?.map((section: any, i: number, a: any[]) => {
                        const lastSection = i === a.length - 1;
                        return (
                            <Section
                                key={i}
                                element={section.elements}
                                section={section}
                                style={section.style[currentWidth]}
                                lastSection={lastSection}
                                activeScreen={currentWidth}
                            />
                        );
                    })}
                </div>
                <Footer Locations="134" />
            </div>

        </div>
    );
};

export default Editor;
