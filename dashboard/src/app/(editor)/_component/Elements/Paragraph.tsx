'use client';

import React, { useRef, useEffect, useState, FocusEvent } from "react";
import { BaseElement } from "@/app/(editor)/_functionality/createElement"; // editor error
import { useMyContext } from "@/Context/EditorContext";

type ParagraphProps = {
  element: BaseElement;
  editable?: boolean;
  style?: React.CSSProperties;
  updateContent: (id: string, property: string, value: any) => void;
  updateElement: (id: string, updatedElement: BaseElement) => void;
  rmElement: (id: string) => void;
};

const Paragraph: React.FC<ParagraphProps> = ({
  element,
  editable = true,
  style,
  updateContent,
  updateElement,
  rmElement,
}) => {
  const elementRef = useRef<HTMLHeadingElement | null>(null);
  const [thisElement, setThisElement] = useState<BaseElement>(element);
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
      elementRef.current.style.outline = "1px dashed black";
    }
    contextRef.setReference(elementRef.current);
  };

  const handleBlur = (e: FocusEvent<HTMLHeadingElement>) => {
    const value = elementRef.current?.innerHTML ?? "";
    setThisElement((prev: BaseElement) => {
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
        elementRef.current.style.outline = "";
        setEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toolbarRef, elementRef]); // contextRef not needed


  // Sync style changes
  useEffect(() => {
    if (isEditing) {
      contextElement.setElement(thisElement);
    }
    updateElement(element.id, thisElement);
  }, [thisElement.style]);

  // Sync content changes
  useEffect(() => {
    updateContent(element.id, "content", thisElement.content);
  }, [thisElement.content]);


  return (
    <p
      className="hover:outline-dashed hover:outline"
      id={element.id}
      ref={elementRef}
      onBlur={handleBlur}
      contentEditable={editable}
      suppressContentEditableWarning={true}
      style={{...style, position: "relative", zIndex: "2"}}
      onFocus={activateTheEditing}
      onClick={(e: React.MouseEvent<HTMLHeadingElement>) => { e.stopPropagation() }}
      onDoubleClick={(e: React.MouseEvent<HTMLHeadingElement>) => { e.stopPropagation() }}
    />
  );
};

export default React.memo(Paragraph);