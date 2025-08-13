'use client';

import React, { useEffect, useRef, useState, MouseEvent } from "react";
import { CreateElement, mapElement } from "../../_functionality/createElement";
import { useMyContext } from "@/Context/EditorContext";
import AddElement from "../common/AddElement";

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
}) => {
  const [openToolBar, setOpenToolBar] = useState(false);
  const [onAddElement, setOnAddElement] = useState(false);
  const [elements, setElements] = useState<ElementType[]>(element);
  const {
    contextRef,
    currentWidth,
    contextElement,
    websiteContent,
    SubmissionObject,
  } = useMyContext();

  const sectionRef = useRef<HTMLElement | null>(null);
  const [sectionStyle, setSectionStyle] = useState<React.CSSProperties>(style);
  // const [allowUpdate, setAllowUpdate] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  const handleMouseDown = (e: MouseEvent) => {
    if (sectionStyle.position !== "absolute") return;

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

    setSectionStyle((prev) => ({
      ...prev,
      left: newLeft,
      top: newTop,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const onEdit = () => {
    onEditing();
    contextElement.setElementSetter(() => () => setSectionStyle);
    contextElement.setElement(sectionStyle)
    if (!onAddElement) {
      if (sectionRef.current) sectionRef.current.style.border = "1px solid black";
    } else {
      if (sectionRef.current) sectionRef.current.style.border = "";
      setOnAddElement(false);
      return;
    }
    setOnAddElement(!onAddElement);
  };

  const addElement = (elementToAdd: keyof typeof CreateElement) => {
    const element = CreateElement[elementToAdd]();
    setElements((prev) => [...prev, element]);
    setOpenToolBar(false);
  };

  const rmElement = (elementID: string) => {
    setElements((prev) => prev.filter((el) => el.id !== elementID));
  };

  const updateTheDataOfElement = (id: string, property: string, value: any) => {
    setElements((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [property]: value } : e))
    );
  };

  const updateElement = (id: string, value: ElementType) => {
    setElements((prev) =>
      prev.map((e) => (e.id === id ? { ...value } : e))
    );
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove as any);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove as any);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove as any);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    function saveToGlobalObject() {
      SubmissionObject.setContent((prev: any[]) =>
        prev.map((e) =>
          e.id === section.id
            ? {
              ...e,
              elements: elements,
              style: {
                ...e.style,
                [currentWidth]: sectionStyle,
              },
            }
            : e
        )
      );
    }

    SubmissionObject.setFinalSubmit((prev: any[]) => {
      const removedSame = prev.filter((e) => e.id !== section.id);
      return [...removedSame, { id: section.id, submit: saveToGlobalObject }];
    });
    contextElement.setElement(sectionStyle)

  }, [elements, sectionStyle, currentWidth]);

  return (
    <div className="relative">
      <section
        ref={sectionRef}
        style={{...sectionStyle, position: "relative"}}
        onDoubleClick={onEdit}
        onMouseDown={handleMouseDown}
      >
        {elements.map((Element, i) => {
          const Component = mapElement[Element.name];
          return (
            <Component
              key={i}
              element={Element}
              updateContent={updateTheDataOfElement}
              updateElement={updateElement}
              style={Element.style?.[currentWidth]}
              currentWidth={currentWidth}
              rmElement={rmElement}
              activeScreen={currentWidth}
            />
          );
        })}
      </section>
      {onAddElement && <AddElement controller={addElement} />}
    </div>
  );
};

export default React.memo(Section);
