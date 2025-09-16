"use client";

import { useRef, useEffect, useState } from "react";
import Section from "../_elements/Section";
import { useMyContext } from "@/Context/ApiContext";
import { notFound, useParams, usePathname, useRouter } from "next/navigation";
import { getContentReq } from "@/functionalities/fetch";
import Header from "../_elements/Header";
import Footer from "../_elements/Footer";
import NotFound from "./not-found";
import HeaderTwo from "../_elements/LandinHeader";



const locations: Record<string, string> = {
  "wicker-park": "e3e1077b-bfd3-468a-b260-58819005fdaa",
  "la-grange": "c994612d-9e5d-47a2-afb8-5388e5e7583e",
  "west-loop": "255cdf30-db19-4277-a550-27374d008dd2"
}

const locationNames = new Set(["wicker-park", "la-grange", "west-loop"])


function detectSlug(slug?: string | string[]): string[] {
  if (!slug) return [];

  const arr = Array.isArray(slug) ? slug : [slug];

  if (arr.length > 1) {
    return [arr[1], arr[0]];
  } else {
    return [arr[0]];
  }
}


const RenderPage = () => {
  const params = useParams()
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter()

  const routeLength: number = params.slug ? params.slug.length : 0
  const singleRoute = routeLength < 2 || params.slug === undefined

  const [page, location] = detectSlug(params.slug) as [string, string?]
  const isLandingPage = !singleRoute || (singleRoute && locationNames.has(page))

  const [pageNotFound, setPageNotFound] = useState(false);

  const {
    width,
    websiteContent,
    currentWidth: activeScreen,
  } = useMyContext();


  // Function to classify width
  const classifyWidth = (w: number) => {
    if (w > 1200) return "xl";
    if (w >= 1024) return "lg";
    if (w >= 600) return "md";
    return "sm";
  };

  useEffect(() => { ///////////
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        width.setWidthSize(newWidth)
        width.setWidth(classifyWidth(newWidth));
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => { ///////////////////////////////////////////////////// Get Content Effect
    async function getContentfromServer() { /////////////////////////////
      try {
        const response: any = await ((singleRoute && locationNames.has(page)) ?
          getContentReq("", locations[page]) :
          getContentReq(page ?? "", location ? locations[location] : undefined));

        console.log(JSON.stringify(response))
        if (response.ok) {
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
  }, [page])

  if (pageNotFound) { ////////////// Page not found /////////////////////
    return (
      <NotFound />
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", height: "100vh", position: "relative", zIndex: 1, overflowX: "hidden" }}
      className=""
    >
      {/* website */}
      <div className="scroll-one bg-zinc-800" style={{ flex: 1, }}>
        {
          (isLandingPage) ?
            <HeaderTwo /> :
            <Header />
        }


        <div
          ref={containerRef}
          style={{
            // position: "relative",
            flex: 1,
            width: "100%",
            margin: "0 auto",
            minHeight: "100vh",
            transition: ".1s linear all",
            backgroundColor: "#e7e5e4", // stone-200
            backgroundSize: "15px 15px", // size of grid squares
            ...(isLandingPage ? { paddingTop: width.widthSize > 800 ? "100px" : "50px" } : {})
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
                style={section.style[activeScreen]}
                lastSection={lastSection}
                activeScreen={activeScreen}
              />
            );
          })}
        </div>
        {/* footer  */}
        <Footer />
      </div>

    </div>
  );
};

export default RenderPage;
