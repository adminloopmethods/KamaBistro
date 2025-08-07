'use client';

import { useRef, useEffect, useState, FocusEvent } from "react";
import { BaseElement } from "@/app/(dashboard)/(editor)/_functionality/createElement";
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

  const activateTheEditing = () => {
    setEditing(true);
    contextElement.setElementSetter(() => () => setThisElement);
    contextElement.setElement(thisElement);
    contextElement?.setRmElementFunc(() => () => rmElement(element.id));
    if (elementRef.current) {
      elementRef.current.style.outline = "1px solid black";
    }
    contextRef.setReference(elementRef.current);
  };

  const handleBlur = (e: FocusEvent<HTMLHeadingElement>) => {
    const value = elementRef.current?.innerHTML ?? "";
    setThisElement((prev) => ({
      ...prev,
      content: value.trim(),
    }));
  };

  // Remove outline if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node) &&
        elementRef.current &&
        !elementRef.current.contains(e.target as Node)
      ) {
        if (elementRef.current) {
          elementRef.current.style.outline = "none";
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextRef]);

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
  }, [thisElement]);

  return (
    <h1
      id={element.id}
      ref={elementRef}
      onBlur={handleBlur}
      contentEditable={editable}
      suppressContentEditableWarning={true}
      style={style}
      onFocus={activateTheEditing}
    />
  );
};

export default Heading;
