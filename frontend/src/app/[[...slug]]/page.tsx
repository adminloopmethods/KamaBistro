"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  Suspense,
  lazy,
} from "react";
import { useMyContext } from "@/Context/ApiContext";
import { useParams } from "next/navigation";
import { getContentReq } from "@/functionalities/fetch";
import Header from "../_elements/Header";
import Footer from "../_elements/Footer";
import NotFound from "./not-found";
import HeaderTwo from "../_elements/LandinHeader";
import { MoonLoader } from "react-spinners";

// ✅ Lazy load Section
const Section = lazy(() => import("../_elements/Section"));

const locations: Record<string, string> = {
  "wicker-park": "e3e1077b-bfd3-468a-b260-58819005fdaa",
  "la-grange": "c994612d-9e5d-47a2-afb8-5388e5e7583e",
  "west-loop": "255cdf30-db19-4277-a550-27374d008dd2",
};

const locationNames = new Set(Object.keys(locations));

function detectSlug(slug?: string | string[]): [string, string?] {
  if (!slug) return [""];
  const arr = Array.isArray(slug) ? slug : [slug];
  return arr.length > 1 ? [arr[1], arr[0]] : [arr[0]];
}

const classifyWidth = (w: number) => {
  if (w > 1200) return "xl";
  if (w >= 1024) return "lg";
  if (w >= 600) return "md";
  return "sm";
};

const RenderPage = () => {
  const params = useParams();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const routeLength = params.slug ? params.slug.length : 0;
  const singleRoute = routeLength < 2 || params.slug === undefined;

  const [page, location] = detectSlug(params.slug) as [string, string?];
  const isLandingPage = !singleRoute || (singleRoute && locationNames.has(page));

  const [pageNotFound, setPageNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    width,
    websiteContent,
    currentWidth: activeScreen,
  } = useMyContext();

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

  // Fetch content
  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await (
        (singleRoute && locationNames.has(page))
          ? getContentReq("", locations[page])
          : getContentReq(page ?? "", location ? locations[location] : undefined)
      );

      if (response.ok) {
        websiteContent.setWebpage(response.webpage);
        width.setEditedWidth(response.webpage.editedWidth);
        setPageNotFound(false);
      } else {
        setPageNotFound(true);
      }
    } catch (err) {
      console.error("Error fetching content:", err);
      setPageNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [page, location, singleRoute]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // ✅ sections to be lazy-loaded together
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-200">
        <MoonLoader size={50} color="#1e293b" />
      </div>
    );
  }

  if (pageNotFound) {
    return <NotFound />;
  }

  return (
    <div
      ref={containerRef}
      className="flex h-screen relative z-10 overflow-x-hidden"
    >
      <div className="scroll-one bg-zinc-800 flex-1">
        {isLandingPage ? <HeaderTwo /> : <Header />}

        <div
          style={{
            flex: 1,
            width: "100%",
            margin: "0 auto",
            minHeight: "100vh",
            transition: ".1s linear all",
            backgroundColor: "#e7e5e4",
            backgroundSize: "15px 15px",
            ...(isLandingPage
              ? { paddingTop: width.widthSize > 800 ? "100px" : "50px" }
              : {}),
          }}
          className="bg-stone-200 poppins-text"
        >
          {/* ✅ One Suspense wrapper for all sections */}
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

        <Footer />
      </div>
    </div>
  );
};

export default RenderPage;
