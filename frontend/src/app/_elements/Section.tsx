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

const Section: React.FC<SectionProps> = ({ //Props
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
    <div className=""
      style={{
        position: thisStyle?.position,
        left: style.left || 0,
        top: style.top || 0,
        // zIndex: 1,
        // (parseFloat(String(style.left ?? "0")) / parseFloat(String(editedWidth))) * widthSize || "0",
        // (parseFloat(String(style.top ?? "0")) / parseFloat(String(editedWidth))) * widthSize || "0",
        // overflow: !sectionIsParent ? "" : ""
      }}
    >
      <section
        ref={sectionRef}
        style={{
          ...style,
          position: "relative",
          top: 0,
          left: 0,
          overflow: "hidden"
          // width: thisStyle?.position === "absolute" ? (parseFloat(String(style.width)) / parseFloat(String(editedWidth))) * widthSize : ""
        }}
      >
        {element.map((Element, i) => { // [{heading}, {para}, {img}] = {name: "h1", content: "text/src", style:{}}
          if (Element.name === "section") {

            return (
              <Section
                key={i}
                element={Element.elements}
                style={Element?.style?.[currentWidth] || {}}
                currentWidth={currentWidth}
                lastSection={lastSection}
                section={Element}
                sectionIsParent={true}
              />
            )
          }
          const Component = mapElement[Element.name]; // mapElement.h1
          return (
            <Component
              key={i}
              element={Element}
              style={Element.style?.[currentWidth]}
              currentWidth={currentWidth}
            />
          );
        })}
      </section>
    </div>
  );
};

export default React.memo(Section);
