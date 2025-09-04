'use client';

import React, { useEffect, useRef, useState, MouseEvent, CSSProperties } from "react";
import { CreateElement, mapElement, ScreenSize } from "../../_functionality/createElement";
import { useMyContext } from "@/Context/EditorContext";
import AddElement from "../common/AddElement";
import { SectionElementType, StyleObject } from "../../_functionality/createSection";
import { convertVWVHtoPxParentClamped } from "@/utils/convertVWVHtoParent";

export type ElementTypeCustom = {
  id: string;
  name: keyof typeof mapElement;
  content?: any;
  style?: {
    [key: string]: React.CSSProperties;
  };
  [key: string]: any;
  hover: { [screen in ScreenSize]?: StyleObject }
};

type SectionProps = {
  element: ElementTypeCustom[];
  rmSection: (id: string) => void;
  onEditing: () => void;
  style: React.CSSProperties;
  updateData: any;
  setUpdateData: React.Dispatch<React.SetStateAction<any>>;
  lastSection: boolean;
  section: {
    id: string;
    [key: string]: any;
  };
  finalUpdate?: (id: string, element: any, lS: Boolean) => void,
  createSection?: any,
  parentIsSection?: Boolean,
  updateParentElement?: (id: string, element: any, lS: Boolean) => void,
  setGivenName: (id: string, value: string) => void;
  parentRef: HTMLElement | null;
};

const Section: React.FC<SectionProps> = ({
  element,
  rmSection,
  onEditing,
  style,
  updateData,
  setUpdateData,
  lastSection,
  section,
  finalUpdate,
  createSection,
  parentIsSection,
  updateParentElement,
  setGivenName,
  parentRef
}) => {
  const [onAddElement, setOnAddElement] = useState(false);
  const [elements, setElements] = useState<ElementTypeCustom[]>(element);
  const [hoverEffect, setHoverEffect] = useState<boolean>(false);
  // const [clickEffect, setClickEffect] = useState<boolean>(false);
  const {
    contextRef,
    activeScreen,
    contextForSection,
    hoverObject,
    screenStyleObj,
    setSectionChildElements,
    setSectionChildElementsSetter,
  } = useMyContext(); ////////////////////// Context /////////////////////////

  const sectionRef = useRef<HTMLElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null)
  const [sectionStyle, setSectionStyle] = useState<React.CSSProperties>(style);
  const [hover, setHover] = useState<React.CSSProperties>(section.hover?.[activeScreen] || {})
  const [hiddenChildlist, setHiddenChildList] = useState<string[]>([])
  const cleanHover = Object.fromEntries(
    Object.entries(hover).filter(([_, value]) => Boolean(value))
  );

  // const childsAreHidden = elements.some((el: any) => el?.style?.[activeScreen]?.display === "block")
  // const [allowUpdate, setAllowUpdate] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);


  const handleMouseDown = (e: MouseEvent) => {
    if (sectionStyle.position !== "absolute" && sectionStyle.position !== "fixed") return;

    const rect = divRef.current?.getBoundingClientRect();
    const parentRect = divRef.current?.parentElement?.getBoundingClientRect();
    if (!rect || !parentRect) return;

    // store where inside the element we clicked (relative to parent space)
    setDragOffsetX(e.clientX - rect.left);
    setDragOffsetY(e.clientY - rect.top);

    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const parentRect = divRef.current?.parentElement?.getBoundingClientRect();
    console.log(parentRect)
    if (!parentRect) return;

    // mouse position inside parent
    const mouseX = e.clientX - parentRect.left;
    const mouseY = e.clientY - parentRect.top;

    // new position = mouse inside parent - click offset
    const newLeft = mouseX - dragOffsetX;
    const newTop = mouseY - dragOffsetY;

    divRef.current?.style.setProperty("left", `${newLeft}px`, "important");
    divRef.current?.style.setProperty("top", `${newTop}px`, "important");
  };

  const handleMouseUp = (e: MouseEvent) => {
    const parentRect = divRef.current?.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    // mouse position inside parent
    const mouseX = e.clientX - parentRect.left;
    const mouseY = e.clientY - parentRect.top;

    // new position = mouse inside parent - click offset
    const newLeft = mouseX - dragOffsetX;
    const newTop = mouseY - dragOffsetY;

    setIsDragging(false);
    setSectionStyle((prev) => ({
      ...prev,
      left: newLeft,
      top: newTop,
    }));
  };


  const onEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    if (!onAddElement) {
      // if (sectionRef.current) sectionRef.current.style.border = "1px solid black";
    } else {
      // if (sectionRef.current) sectionRef.current.style.border = "1px dashed gray";
      setOnAddElement(false);
      return;
    }
    setOnAddElement(!onAddElement);
  };

  const onStyleEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    onEditing();
    // console.log(section.givenName)
    contextForSection.setRmSection(() => () => rmSection(section.id))
    contextForSection.setCurrentSection(sectionStyle)
    contextForSection.setCurrentSectionSetter(() => setSectionStyle)
    contextForSection.setSectionRef(sectionRef)
    contextForSection.setSectionGivenName(() => (value: string) => { setGivenName(section.id, value) })
    contextForSection.setSectionName(section.givenName)

    hoverObject.setHoverContext(hover) // set the contexts for hover
    hoverObject.setHoverContextSetter(() => ((newValue: React.CSSProperties) => {
      setHover((prev: CSSProperties) => ({ ...prev, ...newValue }))
    }))

    screenStyleObj.setScreenStyle(section.style)

    setSectionChildElements(elements)
    setSectionChildElementsSetter(() =>
      (id: string, checked: boolean) => {
        setHiddenChildList((prev: string[]) => prev.filter((e: string) => e !== id))
        setElements((prev: ElementTypeCustom[]) =>
          prev.map((e: ElementTypeCustom) =>
            e.id === id
              ? {
                ...e,
                style: {
                  ...e.style,
                  [activeScreen]: {
                    ...e.style?.[activeScreen],
                    display: checked ? "none" : "block",
                  },
                },
              }
              : e
          )
        )
      })
  }

  const addElement = (elementToAdd: keyof typeof CreateElement) => {
    let element: any;
    if (elementToAdd === "section") {
      element = createSection["section"]();
    } else {
      element = CreateElement[elementToAdd]();
    }
    setElements((prev) => [...prev, element]);
  };

  const rmElement = (elementID: string) => {
    setElements((prev) => prev.filter((el) => el.id !== elementID));
  };

  const updateElement = (id: string, value: ElementTypeCustom) => {
    setElements((prev) =>
      prev.map((e) => (e.id === id ? { ...value } : e))
    );
  };


  const updateTheDataOfElement = (id: string, property: string, value: any) => {
    setElements((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [property]: value } : e))
    );
  };

  const updateForSection = (id: string, element: SectionElementType, lastSection?: Boolean) => {
    setElements((prev: any | null) => {
      if (!prev) return null
      const newContent = prev?.map((e: any) => {
        if (e.id === id) { return element }
        else { return e }
      })
      return newContent
    })
  }


  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove as any);
      window.addEventListener("mouseup", handleMouseUp as any);
    } else {
      window.removeEventListener("mousemove", handleMouseMove as any);
      window.removeEventListener("mouseup", handleMouseUp as any);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove as any);
      window.removeEventListener("mouseup", handleMouseUp as any);
    };
  }, [isDragging]);

  useEffect(() => {
    if (finalUpdate) {
      finalUpdate(section.id, { ...section, elements: elements, hover: { ...section.hover, [activeScreen]: hover } }, lastSection)
    }


  }, [updateData, elements, hover]);

  useEffect(() => {

    // setSectionChilds(() => SectionChilds(elements, setElements, activeScreen))
  }, [elements])


  useEffect(() => {
    if (updateParentElement) {
      updateParentElement(section.id, { ...section, elements: elements, hover: { ...section.hover, [activeScreen]: hover } }, lastSection)
    }
    hoverObject.setHoverContext(hover)
  }, [elements, hover])

  useEffect(() => {
    if (finalUpdate) {
      finalUpdate(section.id, { ...section, style: { ...section.style, [activeScreen]: sectionStyle }, hover: { ...section.hover, [activeScreen]: hover } }, lastSection)
    }

    if (updateParentElement) {
      updateParentElement(section.id, { ...section, style: { ...section.style, [activeScreen]: sectionStyle }, hover: { ...section.hover, [activeScreen]: hover } }, lastSection)
    }
    contextForSection.setCurrentSection(sectionStyle)
  }, [sectionStyle])

  useEffect(() => {
    setSectionStyle((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(style)) {
        return style;
      }
      return prev;
    });
  }, [style]);

  useEffect(() => {
    if (divRef.current?.style) {
      divRef.current.style.border = "1px dashed gray";
    }
  }, [])

  const showAllChildren = () => {
    setElements((prev: ElementTypeCustom[]) =>
      prev.map((e: ElementTypeCustom) => {
        if (e.style?.[activeScreen]?.display === "none") {
          setHiddenChildList((prev: string[]) => {
            return [...prev, e.id]
          })
        }
        return (e?.style?.[activeScreen]?.display === "none" ?
          {
            ...e,
            style: {
              ...e.style,
              [activeScreen]: {
                ...e.style?.[activeScreen],
                display: "block", // toggle
              },
            },
          } : e
        )
      })
    )
  }

  const hideBackHiddenChildrens = () => {
    if (hiddenChildlist.length > 0) {
      setElements((prev: ElementTypeCustom[]) =>
        prev.map((e: ElementTypeCustom) => {
          return (hiddenChildlist.includes(e.id) ?
            {
              ...e,
              style: {
                ...e.style,
                [activeScreen]: {
                  ...e.style?.[activeScreen],
                  display: "none", // toggle
                },
              },
            } : e
          )
        })
      )
    }
  }

  const runningWidth = activeScreen !== "xl";
  const runningStyle = runningWidth ? convertVWVHtoPxParentClamped(sectionStyle, parentRef) : sectionStyle

  return (
    <div className=""
      ref={divRef}
      style={{
        position: sectionStyle?.position,
        left: sectionStyle?.left,
        top: sectionStyle?.top,
        overflow: "visible",
        // height: "fit-content"
      }}
    >
      <section
        ref={sectionRef}
        style={{
          ...(runningStyle),
          transition: ".3s all linear", top: 0, left: 0, position: "relative", ...(hoverEffect ? cleanHover : {})
        }}
        onDoubleClick={onEdit}
        onClick={onStyleEdit}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => { setHoverEffect(true); showAllChildren() }}
        onMouseLeave={() => { setHoverEffect(false); hideBackHiddenChildrens() }}
      // className={hover}
      >
        {elements?.map((Element, i, a) => {
          const lastSection = i === a.length - 1
          if (Element.name === "section") {

            return (
              <Section
                key={i}
                element={Element.elements}
                section={Element}
                style={Element.style?.[activeScreen] || {}}
                rmSection={rmElement}
                onEditing={() => {
                  contextRef.setContextRef(null);
                }}
                updateData={updateData}
                setUpdateData={setUpdateData}
                updateParentElement={updateForSection}
                lastSection={lastSection}
                parentIsSection={true}
                setGivenName={setGivenName}
                parentRef={parentRef}
              />)

          } else {
            const Component = mapElement[Element.name];
            return (
              <Component
                key={i}
                element={Element}
                updateContent={updateTheDataOfElement}
                updateElement={updateElement}
                style={Element.style?.[activeScreen]}
                currentWidth={activeScreen}
                rmElement={rmElement}
                activeScreen={activeScreen}
                parentRef={parentRef}
              />
            );
          }
        })}
      </section>
      {onAddElement && <AddElement controller={addElement} canAddSection={!parentIsSection} />}
    </div >
  );
};

export default React.memo(Section);