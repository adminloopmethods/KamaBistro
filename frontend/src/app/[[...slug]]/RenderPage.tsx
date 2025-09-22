"use client";

import { useEffect, useRef, useMemo, Suspense, lazy, useState } from "react";
import { useMyContext } from "@/Context/ApiContext";
import Header from "../_elements/Header";
// import Footer from "../_elements/Footer";
import NotFound from "./not-found";
import HeaderTwo from "../_elements/LandinHeader";
import { MoonLoader } from "react-spinners";


const locations: Record<string, string> = {
  "wicker-park": "e3e1077b-bfd3-468a-b260-58819005fdaa",
  "la-grange": "c994612d-9e5d-47a2-afb8-5388e5e7583e",
  "west-loop": "255cdf30-db19-4277-a550-27374d008dd2",
};


const Section = lazy(() => import("../_elements/Section"));

const classifyWidth = (w: number) => {
  if (w > 1200) return "xl";
  if (w >= 1024) return "lg";
  if (w >= 600) return "md";
  return "sm";
};

export default function RenderPage({
  initialData,
  slugParams,
}: {
  initialData: any;
  slugParams?: string[];
}) {
  // console.log(JSON.stringify(initialData))
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pageNotFound, setPageNotFound] = useState(!initialData);
  const locationsSet = new Set(Object.keys(locations))

  const {
    width,
    websiteContent,
    currentWidth: activeScreen,
  } = useMyContext();


  // Load initial server data into context
  useEffect(() => {
    if (initialData) {
      websiteContent.setWebpage(initialData);
      width.setEditedWidth(initialData.editedWidth);
      setPageNotFound(false);
    } else {
      setPageNotFound(true);
    }
  }, [initialData, websiteContent, width]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        width.setWidthSize(newWidth);
        width.setWidth(classifyWidth(newWidth));
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [width]);

  // Memoize sections
  const sections = useMemo(
    () =>
      websiteContent?.webpage?.contents?.map(
        (section: any, i: number, a: any[]) => (
          <Section
            key={section.id ?? i}
            element={section.elements}
            section={section}
            style={section.style?.[activeScreen]}
            lastSection={i === a.length - 1}
            activeScreen={activeScreen}
          />
        )
      ),
    [websiteContent, activeScreen]
  );

  const basePagesCondition = (slugParams && slugParams.length === 1 && !locationsSet.has(slugParams[0])) || slugParams === undefined

  if (pageNotFound) {
    return <NotFound />;
  }

  return (
    <div ref={containerRef} className="flex h-screen relative z-10 overflow-x-hidden">
      <div className="scroll-one bg-zinc-800 flex-1">
        {/* Header based on landing vs normal */}
        {basePagesCondition ? <Header /> : <HeaderTwo />}

        <div
          style={{
            flex: 1,
            width: "100%",
            margin: "0 auto",
            minHeight: "100vh",
            transition: ".1s linear all",
            backgroundColor: "#e7e5e4",
            backgroundSize: "15px 15px",
            ...(basePagesCondition ? {} : { paddingTop: width.widthSize > 800 ? "100px" : "50px" }),
          }}
          className="bg-stone-200 poppins-text"
        >
          <Suspense
            fallback={
              <div className="flex h-screen items-center justify-center">
                <MoonLoader size={50} color="#1e293b" />
              </div>
            }
          >
            {sections}
          </Suspense>
        </div>

        {/* <Footer />*/}
      </div>
    </div>
  );
}
