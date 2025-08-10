"use client";

import { useRef, useEffect, useState } from "react";
import Section from "./_elements/Section";
import { useMyContext } from "@/Context/ApiContext";
import { usePathname, useRouter } from "next/navigation";
import { getContentReq } from "@/functionalities/fetch";

const Editor = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter()
  const nav = usePathname()
  const navigationArray = nav.split("/")
  const page = navigationArray[2]

  const {
    width,
    websiteContent,
    currentWidth,
  } = useMyContext();


  // Function to classify width
  const classifyWidth = (w: number) => {
    if (w > 1024) return "xl";
    if (w >= 768) return "lg";
    if (w >= 425) return "md";
    return "sm";
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
    // if (page) {
      async function getContentfromServer() {
        try {
          const response: any = await getContentReq("home-page")
              console.log(response)
          if (response.ok) {
            websiteContent.setContent(response.contents)
          } else {
            throw new Error("error while fetch the page")
          }
        } catch (err) {
          console.error(err)
        }
      }

      getContentfromServer()
    // }
  }, [page])

  return (
    <div ref={containerRef} style={{ position: "relative", display: "flex", height: "100vh" }}>
      {/* website */}
      <div style={{ position: "relative", flex: 1, overflowY: "scroll" }} className="scroll-one">
        {websiteContent?.contents?.map((section: any, i: number, a: any[]) => {
          const lastSection = i === a.length - 1;
          return (
            <Section
              key={i}
              element={section.elements}
              section={section}
              style={section.style[currentWidth]}
              lastSection={lastSection}
            />
          );
        })}
      </div>

    </div>
  );
};

export default Editor;
