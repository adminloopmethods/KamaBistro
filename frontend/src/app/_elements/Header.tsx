'use client';

import React, { useRef } from "react";
import { useMyContext } from "@/Context/ApiContext";
import { mapElement } from "@/functionalities/createElement";

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
  style: React.CSSProperties;
  lastSection: boolean;
  section: {
    id?: string;
    [key: string]: any;
  };
  currentWidth: string;
  sectionIsParent?: Boolean
};

const Header: React.FC<SectionProps> = ({ //Props
  element,
  style,
  lastSection,
  section,
  sectionIsParent,
}) => { // function starts here

  const { //////////// Context variable
    currentWidth,
    widthSize,
    editedWidth,
  } = useMyContext(); ////////////////////////////Context is here

  const thisStyle = section?.style?.[currentWidth]

  const sectionRef = useRef<HTMLElement | null>(null);

  // const setPosition = thisStyle?.position === "absolute" ? (sectionIsParent ? "absolute" : "fixed") : thisStyle.position;

  // const widthIsRatio = String(style?.width).slice(-1) === "%"


  return (
      <header
        ref={sectionRef}
        style={{
          ...style,
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "hidden"
        }}
      >
        
      </header>
  );
};

export default React.memo(Header);
