'use client';

import React, { useEffect, useRef, useState, MouseEvent } from "react";
import { CreateElement, mapElement } from "../../_functionality/createElement";
import { useMyContext } from "@/Context/EditorContext";
import AddElement from "../common/AddElement";
import { SectionElementType } from "../../_functionality/createSection";

type ElementType = {
  id: string;
  name: keyof typeof mapElement;
  content?: any;
  style?: {
    [key: string]: React.CSSProperties;
  };
  [key: string]: any;
};

type SectionProps = {
  element: ElementType[];
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
  updateParentElement
}) => {
  const [onAddElement, setOnAddElement] = useState(false);
  const [elements, setElements] = useState<ElementType[]>(element);
  const {
    contextRef,
    activeScreen,
    contextForSection,
  } = useMyContext();

  const sectionRef = useRef<HTMLElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null)
  const [sectionStyle, setSectionStyle] = useState<React.CSSProperties>(style);
  // const [allowUpdate, setAllowUpdate] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  const handleMouseDown = (e: MouseEvent) => {
    if (sectionStyle.position !== "absolute" && sectionStyle.position !== "fixed") return;

    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragOffsetX(e.clientX - rect.left);
    setDragOffsetY(e.clientY - rect.top);
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newLeft = e.clientX - dragOffsetX;
    const newTop = e.clientY - dragOffsetY;

    sectionRef.current?.style.setProperty("top", `${newTop}px`, "important")
    sectionRef.current?.style.setProperty("left", `${newLeft}px`, "important")
    divRef.current?.style.setProperty("top", `${newTop}px`, "important")
    divRef.current?.style.setProperty("left", `${newLeft}px`, "important")

  };

  const handleMouseUp = (e: MouseEvent) => {
    const newLeft = e.clientX - dragOffsetX;
    const newTop = e.clientY - dragOffsetY;

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
    contextForSection.setRmSection(() => () => rmSection(section.id))
    contextForSection.setCurrentSection(sectionStyle)
    contextForSection.setCurrentSectionSetter(() => setSectionStyle)
    contextForSection.setSectionRef(sectionRef)
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

  const updateElement = (id: string, value: ElementType) => {
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
      finalUpdate(section.id, { ...section, elements: elements }, lastSection)
    }

  }, [updateData, elements]);

  useEffect(() => {
    if (updateParentElement) {
      updateParentElement(section.id, { ...section, elements: elements }, lastSection)
    }
  }, [elements])

  useEffect(() => {
    if (finalUpdate) {
      finalUpdate(section.id, { ...section, style: { ...section.style, [activeScreen]: sectionStyle } }, lastSection)
    }

    if (updateParentElement) {
      updateParentElement(section.id, { ...section, style: { ...section.style, [activeScreen]: sectionStyle } }, lastSection)
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
      console.log(divRef.current.style.width)
      divRef.current.style.border = "1px dashed gray";
    }
  }, [])

  // useEffect(() => {
  //   if (!sectionRef.current) return;
  //   if (sectionStyle.position !== "absolute" && sectionStyle.position !== "fixed") return;

  //   const observer = new ResizeObserver((entries) => {
  //     for (let entry of entries) {
  //       const width = Math.round(entry.contentRect.width);

  //       setSectionStyle((prev) => {
  //         if (prev.width !== `${width}px`) {
  //           return { ...prev, width: `${width}px` };
  //         }
  //         return prev;
  //       });

  //       // ✅ disconnect after first lock to avoid flicker
  //       observer.disconnect();
  //     }
  //   });

  //   observer.observe(sectionRef.current);
  //   observer.disconnect();


  //   return () => observer.disconnect();
  // }, [sectionStyle.position]);



  // const setPosition = sectionStyle?.position === "absolute" ? parentIsSection ? "absolute" : "fixed" : "static";
  return (
    <div className="relative"
      ref={divRef}
      style={{
        position: sectionStyle?.position,
        left: sectionStyle?.left,
        top: sectionStyle?.top,
      }}
    >
      <section
        ref={sectionRef}
        style={{ ...sectionStyle, top: 0, left: 0, position: "static" }}
        onDoubleClick={onEdit}
        onClick={onStyleEdit}
        onMouseDown={handleMouseDown}
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
              />
            );
          }
        })}
      </section>
      {onAddElement && <AddElement controller={addElement} canAddSection={!parentIsSection} />}
    </div>
  );
};

export default React.memo(Section);