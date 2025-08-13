'use client';

import React, { useRef, useEffect, useState, FocusEvent } from "react";
import { BaseElement } from "@/app/(editor)/_functionality/createElement"; // editor error
import { useMyContext } from "@/Context/EditorContext";

type HeadingProps = {
  element: BaseElement;
  editable?: boolean;
  style?: React.CSSProperties;
  updateContent: (id: string, property: string, value: any) => void;
  updateElement: (id: string, updatedElement: BaseElement) => void;
  rmElement: (id: string) => void;
};

const Heading: React.FC<HeadingProps> = ({
  element,
  editable = true,
  style,
  updateContent,
  updateElement,
  rmElement,
}) => {
  console.log("console.from.heading")
  const elementRef = useRef<HTMLHeadingElement | null>(null);
  const [thisElement, setThisElement] = useState<BaseElement>(element);
  console.log(element)
  console.log(thisElement)
  const { contextRef, contextElement, toolbarRef } = useMyContext();
  const [isEditing, setEditing] = useState<boolean>(false);

  // Set innerHTML when content updates
  useEffect(() => {
    if (elementRef.current && (element.content || element.content === "")) {
      elementRef.current.innerHTML = element.content;
    }
  }, [element.content]);

  const activateTheEditing = (e: any) => {
    e.stopPropagation()

    setEditing(true);
    contextElement.setElementSetter(() => setThisElement);
    contextElement.setElement(thisElement);
    contextElement?.setRmElementFunc(() => () => rmElement(element.id));
    if (elementRef.current) {
      elementRef.current.style.outline = "1px solid black";
    }
    contextRef.setReference(elementRef.current);
  };

  const handleBlur = (e: FocusEvent<HTMLHeadingElement>) => {
    const value = elementRef.current?.innerHTML ?? "";
    setThisElement((prev: BaseElement) => {
      console.log(prev)
      return ({
        ...prev,
        content: value.trim(),
      })
    });

  };

  // Remove outline if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!elementRef.current) return;

      const clickedToolbar =
        toolbarRef.current?.contains(e.target as Node) ?? false;
      const clickedElement =
        elementRef.current?.contains(e.target as Node) ?? false;

      if (!clickedToolbar && !clickedElement) {
        elementRef.current.style.outline = "none";
        setEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toolbarRef, elementRef]); // contextRef not needed


  // Sync style changes
  useEffect(() => {
    if (isEditing) {
      // contextElement.setElement(thisElement);
    }
    updateElement(element.id, thisElement);
  }, [thisElement.style]);

  // Sync content changes
  useEffect(() => {
    updateContent(element.id, "content", thisElement.content);
  }, [thisElement.content]);


  return (
    <h1
      id={element.id}
      ref={elementRef}
      onBlur={handleBlur}
      contentEditable={editable}
      suppressContentEditableWarning={true}
      style={style}
      onFocus={activateTheEditing}
      onClick={(e: React.MouseEvent<HTMLHeadingElement>) => { e.stopPropagation() }}
      onDoubleClick={(e: React.MouseEvent<HTMLHeadingElement>) => { e.stopPropagation() }}
    />
  );
};

export default React.memo(Heading);