'use client';

import React, { useEffect, useRef, useState, MouseEvent } from "react";
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

const Section: React.FC<SectionProps> = ({
  element,
  style,
  lastSection,
  section,
  sectionIsParent
}) => {
  const {
    currentWidth,
  } = useMyContext();

  const thisStyle = section?.style?.[currentWidth]

  const sectionRef = useRef<HTMLElement | null>(null);

  const setPosition = thisStyle?.position === "absolute" ? sectionIsParent ? "absolute" : "fixed" : "static";

  return (
    <div className="relative"
      style={{
        position: style.position,
        left: style.left,
        top: style.top,
        overflow: !sectionIsParent ? "hidden" : ""
      }}
    >
      <section
        ref={sectionRef}
        style={{
          ...style,
          position: setPosition,
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
