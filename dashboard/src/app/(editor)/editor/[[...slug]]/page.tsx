"use client";

import React, {useRef, useEffect, useState, CSSProperties} from "react";
import {useMyContext, webpageType} from "@/Context/EditorContext";
import {useParams} from "next/navigation";
import {
  createContentReq,
  getLocationsReq,
  getProposedUpdatesByIDReq,
  getUserProfileReq,
  getWebpageReq,
  proposeUpdateReq,
  saveContentReq,
  approveProposedVersionReq,
} from "@/functionality/fetch";
import {toastWithUpdate} from "@/functionality/ToastWithUpdate";
import Section from "../../_component/Elements/Section";
import {
  CreateSection,
  SectionElementType,
} from "../../_functionality/createSection";
import AddSection from "../../_component/common/AddSection";
import RichTextToolBar from "../../_component/common/RichTextToolbar";
import StyleToolbar from "../../_component/common/StyleToolbar";
import DimensionToolbar, {
  updateStylesType,
} from "../../_component/common/DimensionToolbar";
import ImageStyleToolbar from "../../_component/common/ImageToolbar";
import {ArrowLeft} from "lucide-react";

import {CiMobile1} from "react-icons/ci";
import {IoIosTabletPortrait} from "react-icons/io";
import {CiLaptop} from "react-icons/ci";
import {CiDesktop} from "react-icons/ci";
import {toast, Toaster} from "sonner";
import {LocationType} from "@/app/(dashboard)/users/CreateNewUser";
import CustomSelect from "@/app/_common/CustomSelect";
import {preSection} from "@/assets/preSection.js";
import {useDraggable} from "../../_component/common/useDraggable";
import HoverToolbar from "../../_component/common/HoverToolbar";
import {useRouter} from "next/navigation";
import ChildElements from "../../_component/common/ChildElements";
import {isAdmin, verifyAdminStatus} from "@/utils/isAdmin";

const renderInput = (
  label: string,
  key: string,
  type: "text" | "number" = "text",
  suffix = "",
  value: string | undefined,
  onChange: (name: string, val: string) => void
) => {
  return (
    <div className="flex flex-col gap-1" key={key}>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => {
          const val = e.target.value;
          onChange(key, val);
        }}
        placeholder={label}
        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
      />
    </div>
  );
};

const Editor = () => {
  const params = useParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const page = params.slug ? params.slug[0] : "";
  const [saveData, setSaveData] = useState<Boolean>(false);
  const [pageWidth, setPageWidth] = useState<number | string>("100%");
  const [locations, setLocations] = useState<LocationType[]>([
    {id: "", name: ""},
  ]);
  const [currentWidth, setCurrentWidth] = useState<string>("");
  const [onHoverToolbar, setOnHoverToolbar] = useState<boolean>(false);
  const [showToolbar, setShowToolbar] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isVerifier, setIsVerifier] = useState(false);
  const [proposedVersionId, setProposedVersionId] = useState<string | null>(
    null
  );
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const router = useRouter();

  const childElementsRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useDraggable(childElementsRef);

  const {
    width,
    websiteContent,
    contextRef,
    imageEdit,
    activeScreen,
    currentSectionSetter,
    finalSubmit,
    setContainerRef,
  } = useMyContext();

  const {webpage, setWebpage} = websiteContent;

  console.log(webpage, "webpage");

  const sectionStyleSetter = currentSectionSetter;

  const saveAllSection = () => {
    if (Array.isArray(finalSubmit)) {
      finalSubmit.forEach((e) => {
        e.submit();
      });
    }
  };

  const handleSave = async () => {
    saveAllSection();

    const bodyPayload: Record<string, any> = {data: {...webpage}};
    if (!bodyPayload.data.name) {
      toast.error("Webpage name is required");
      return;
    }
    if (!bodyPayload.data.route) {
      toast.error("Webpage route is required");
      return;
    }

    try {
      let response;

      const isSuperUser = await verifyAdminStatus();

      if (isSuperUser) {
        response = await toastWithUpdate(
          () =>
            page
              ? saveContentReq(page, bodyPayload.data)
              : createContentReq(bodyPayload.data),
          {
            loading: page ? "Updating content..." : "Saving Content...",
            success: "Successfully saved the content!",
            error: (err: any) => err?.message || "Failed to save content",
          }
        );
      } else {
        response = await toastWithUpdate(
          () => proposeUpdateReq(page, bodyPayload),
          {
            loading: "Submitting changes for review...",
            success:
              "Changes submitted successfully! Waiting for verification.",
            error: (err: any) =>
              err?.message || "Failed to submit changes for review",
          }
        );
      }

      if (response.ok) {
        console.log("Operation successful:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleApprove = async () => {
    if (!proposedVersionId) return;

    setIsApproving(true);
    try {
      const response = await approveProposedVersionReq(proposedVersionId);

      if (response.ok) {
        toast.success("Changes approved successfully!");
        router.push("/pages");
      } else {
        toast.error(response.error || "Failed to approve changes");
      }
    } catch (error) {
      toast.error("Error approving changes");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!proposedVersionId) return;

    setIsRejecting(true);
    try {
      // You'll need to implement a reject API endpoint
      toast.error("Reject functionality not implemented yet");
    } catch (error) {
      toast.error("Error rejecting changes");
    } finally {
      setIsRejecting(false);
    }
  };

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await getUserProfileReq();

        if (response && response.ok && response.user) {
          const currentPageId = page;
          const pageRole = response.user.pageRoles?.find(
            (pr: any) => pr.webpageId === currentPageId
          );

          if (pageRole) {
            const isVerifierForThisPage = pageRole.role?.name === "VERIFIER";
            setIsVerifier(isVerifierForThisPage);
            setUserRole(pageRole.role?.name || "EDITOR");
          } else {
            const isVerifierUser = response.user.pageRoles?.some(
              (pr: any) => pr.role?.name === "VERIFIER"
            );
            setIsVerifier(isVerifierUser);
            setUserRole(isVerifierUser ? "VERIFIER" : "EDITOR");
          }
        } else {
          console.error("Failed to fetch user role - response not ok");
          setIsVerifier(false);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsVerifier(false);
      }
    };

    checkUserRole();
  }, [page]);

  const classifyWidth = (w: number) => {
    if (w > 1200) return "xl";
    if (w >= 1024) return "lg";
    if (w >= 600) return "md";
    return "sm";
  };

  const applySMScreen = () => {
    setPageWidth("400px");
  };

  const applyMDScreen = () => {
    setPageWidth("600px");
  };

  const applyLGScreen = () => {
    setPageWidth("1024px");
  };

  const applyXLScreen = () => {
    setPageWidth("100%");
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        width.setWidthValue(
          classifyWidth(newWidth) === "xl" ? `${newWidth}px` : "1280px"
        );
        setCurrentWidth(
          classifyWidth(newWidth) === "xl" ? `${newWidth}px` : "1280px"
        );
        width.setActiveScreen(classifyWidth(newWidth));
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const addSection = (section = "section") => {
    setWebpage((prev: webpageType | null) => {
      if (!prev) return null;
      return {
        ...prev,
        contents: [...prev.contents, CreateSection["section"]()],
      };
    });
  };

  const setGivenName = (id: string, name: string) => {
    setWebpage((prev: webpageType | null) => {
      if (!prev) return null;
      const newArray = prev.contents.map((e: any) => {
        if (e.id === id) {
          return {...e, givenName: name};
        } else {
          return e;
        }
      });
      return {...prev, contents: newArray};
    });
  };

  const rmSection = (sectionId: string) => {
    setWebpage((prev: webpageType | null) => {
      if (!prev) return null;
      const newSet = prev.contents.filter(
        (element: any) => element.id !== sectionId
      );
      return {...prev, contents: newSet};
    });
  };

  const updateSectionStyles: updateStylesType = (newStyle, applyAll) => {
    if (applyAll && sectionStyleSetter) {
      sectionStyleSetter(newStyle);
    }
    if (sectionStyleSetter) {
      sectionStyleSetter((prev: CSSProperties) => {
        return {...prev, ...newStyle};
      });
    }
  };

  const finalUpdate = (
    id: string,
    element: SectionElementType,
    lastSection?: Boolean
  ) => {
    setWebpage((prev: webpageType | null) => {
      if (!prev) return null;
      const newContent = prev.contents?.map((e: SectionElementType) => {
        if (e.id === id) return element;
        else return e;
      });
      return {
        ...prev,
        contents: newContent,
      };
    });

    if (lastSection) setSaveData(false);
  };

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
      const bodyPayload: Record<string, any> = {...webpage};
      if (!bodyPayload.name) return toast.error("Webpage name is required");
      if (!bodyPayload.route) return toast.error("Webpage route is required");

      try {
        const response = await toastWithUpdate(
          () =>
            page
              ? saveContentReq(page, bodyPayload)
              : createContentReq(bodyPayload),
          {
            loading: page ? "Updating content..." : "Saving Content...",
            success: "Successful saved the content!",
            error: (err: any) => err?.message || "Failed to create the content",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Successfully sent content:", response);
      } catch (error) {}
    }

    if (saveData) {
      updateData();
      setSaveData(false);
    }
  }, [saveData]);

  useEffect(() => {
    if (page) {
      const id: string = page;

      const fetchData = async () => {
        try {
          let response: any;

          if (isVerifier) {
            response = await getProposedUpdatesByIDReq(id);
            console.log("Proposed version response:", response);
            if (response?.ok) {
              setProposedVersionId(response.proposedVersion.id);
              setWebpage(response.proposedVersion.version);
              console.log(response.proposedVersion.version, "version");
            } else {
              toast.error(response.error || "Failed to fetch proposed version");
            }
          } else {
            response = await getWebpageReq(id);
            console.log("Webpage response:", response.webpage);
            if (response.ok) {
              setWebpage(response.webpage);
            } else {
              toast.error(response.error || "Failed to fetch webpage");
            }
          }
        } catch (err) {
          console.error(err);
          toast.error("Error fetching data");
        }
      };

      fetchData();
    } else {
      setWebpage({
        id: crypto.randomUUID(),
        route: "",
        locationId: "",
        name: "",
        contents: preSection.contents,
        createdAt: "",
        updatedAt: "",
        editedWidth: currentWidth ? currentWidth : "1280px",
      });
    }
  }, [page, isVerifier]);

  const setMetaOfPage = (name: string, value: string) => {
    setWebpage((prev: webpageType | null) => {
      if (!prev)
        return {
          id: crypto.randomUUID(),
          route: "",
          locationId: "",
          name: "",
          contents: [],
          createdAt: "",
          updatedAt: "",
          editedWidth: currentWidth ? currentWidth : "1280px",
          [name]: value,
        };

      return {...prev, [name]: value};
    });
  };

  useEffect(() => {
    setContainerRef(containerRef.current);
  }, [containerRef.current]);

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="h-[8vh] bg-slate-700 flex justify-between items-center p-2 gap-8">
        <button
          onClick={() => router.back()}
          className="cursor-pointer bg-stone-200 p-1 rounded-[50%]"
        >
          <ArrowLeft color="#808080" />
        </button>

        <div className="flex justify-end items-center gap-8">
          {isVerifier ? (
            <>
              <button
                className="text-sm cursor-pointer bg-green-600 w-[150px]"
                style={{
                  border: "none",
                  padding: "6px 8px",
                  borderRadius: "2px",
                  color: "white",
                }}
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving ? "Approving..." : "Approve Changes"}
              </button>
              <button
                className="text-sm cursor-pointer bg-red-600 w-[150px]"
                style={{
                  border: "none",
                  padding: "6px 8px",
                  borderRadius: "2px",
                  color: "white",
                }}
                onClick={handleReject}
                disabled={isRejecting}
              >
                {isRejecting ? "Rejecting..." : "Reject Changes"}
              </button>
            </>
          ) : (
            <>
              <div className=" text-white text-xl p-1 flex justify-evenly gap-2">
                <button
                  onClick={() => applyXLScreen()}
                  className={`${styleForScreenIcons} ${
                    activeScreen === "xl" && "bg-stone-500"
                  }`}
                  title="1200px+"
                >
                  <CiDesktop />
                </button>
                <button
                  onClick={() => applyLGScreen()}
                  className={`${styleForScreenIcons} ${
                    activeScreen === "lg" && "bg-stone-500"
                  }`}
                  title="1024px"
                >
                  <CiLaptop />
                </button>
                <button
                  onClick={() => applyMDScreen()}
                  className={`${styleForScreenIcons} ${
                    activeScreen === "md" && "bg-stone-500"
                  }`}
                  title="600px"
                >
                  <IoIosTabletPortrait />
                </button>
                <button
                  onClick={() => applySMScreen()}
                  className={`${styleForScreenIcons} ${
                    activeScreen === "sm" && "bg-stone-500"
                  }`}
                  title="390px"
                >
                  <CiMobile1 />
                </button>
              </div>
              <button
                className="text-sm cursor-pointer bg-emerald-500 w-[120px]"
                style={{
                  border: "none",
                  padding: "6px 8px",
                  borderRadius: "2px",
                  color: "white",
                  top: 0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOnHoverToolbar(!onHoverToolbar);
                }}
              >
                {onHoverToolbar ? "Styles" : "Hover styles"}
              </button>

              <button
                className="text-sm cursor-pointer bg-emerald-500 w-[120px]"
                style={{
                  border: "none",
                  padding: "6px 8px",
                  borderRadius: "2px",
                  color: "white",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowToolbar(!showToolbar);
                }}
              >
                {showToolbar ? "Hide Toolbar" : "Show Toolbar"}
              </button>
              <button
                className="text-sm cursor-pointer"
                style={{
                  backgroundColor: "#007bff",
                  border: "none",
                  padding: "6px 8px",
                  borderRadius: "2px",
                  color: "white",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          height: "92vh",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <div
          className="scroll-one bg-zinc-800"
          style={{
            flex: 1,
            overflowY: "scroll",
            overflowX: "hidden",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            ref={containerRef}
            style={{
              flex: 1,
              width: pageWidth,
              margin: "0 auto",
              transform: activeScreen !== "xl" ? "translateX(-120px)" : "",
              minHeight: "100vh",
              transition: ".1s linear all",
              backgroundColor: "#e7e5e4",
              backgroundImage: `
                                linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                                `,
              backgroundSize: "15px 15px",
              position: "relative",
              zIndex: 1,
              overflow: "hidden",
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
                  parentRef={containerRef.current}
                  readOnly={isVerifier}
                />
              );
            })}
            {!isVerifier && showToolbar && (
              <AddSection controller={addSection} />
            )}
          </div>
        </div>

        {!isVerifier && showToolbar && (
          <div
            ref={toolbarRef}
            style={{
              width: "250px",
              backgroundColor: "#393E46",
              height: "92vh",
              overflowY: "scroll",
              zIndex: 1000,
              display: showToolbar ? "block" : "none",
            }}
            className="scroll-one fixed top-[8vh] right-0"
          >
            <div className="p-2 w-[240px] px-4 flex gap-5 flex-col my-4">
              {renderInput(
                "Name",
                "name",
                "text",
                "",
                webpage?.name,
                setMetaOfPage
              )}
              {renderInput(
                "Route",
                "route",
                "text",
                "",
                webpage?.route,
                setMetaOfPage
              )}
              <CustomSelect
                options={
                  locations
                    ?.map((e) => ({label: e.name, value: e.id}))
                    .concat([{label: "Base Page", value: ""}]) || []
                }
                firstOption="Set Location"
                disableFirstValue={true}
                Default={webpage?.locationId || ""}
                onChange={(value) => {
                  setWebpage((prev: webpageType | null) => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      locationId: value,
                    };
                  });
                }}
              />
            </div>
            {onHoverToolbar ? (
              <HoverToolbar />
            ) : !contextRef.activeRef ? (
              <>
                <DimensionToolbar updateStyles={updateSectionStyles} />
                <StyleToolbar
                  updateStyles={updateSectionStyles}
                  rmSection={rmSection}
                />
                <ChildElements ref={childElementsRef} />
              </>
            ) : imageEdit ? (
              <ImageStyleToolbar />
            ) : (
              <RichTextToolBar />
            )}
          </div>
        )}

        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default Editor;

const styleForScreenIcons = "p-2 hover:bg-stone-500 cursor-pointer rounded-sm";
