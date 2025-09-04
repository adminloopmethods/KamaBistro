'use client';

import { useRef, useEffect, useState, FocusEvent } from "react";
import { BaseElement } from "@/functionalities/createElement";
// import { useMyContext } from "@/Context/ApiContext";

type HeadingProps = {
  element: BaseElement;
  style?: React.CSSProperties;
};

const Heading: React.FC<HeadingProps> = ({
  element,
  style,
}) => {
  const elementRef = useRef<HTMLHeadingElement | null>(null);

  // Set innerHTML when content updates
  useEffect(() => {
    if (elementRef.current && (element.content || element.content === "")) {
      elementRef.current.innerHTML = element.content;
    }
  }, [element.content]);


  return (
    <h1
      id={element.id}
      ref={elementRef}
      suppressContentEditableWarning={true}
      style={{ ...style, position: "relative", zIndex: "2" }}
    />
  );
};

export default Heading;
