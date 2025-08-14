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
    id: string;
    [key: string]: any;
  };
};

const Section: React.FC<SectionProps> = ({
  element,
  style,
  lastSection,
  section,
}) => {
  const {
    currentWidth,
  } = useMyContext();

  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <div className="relative">
      <section
        ref={sectionRef}
        style={style}
      >
        {element.map((Element, i) => { // [{heading}, {para}, {img}] = {name: "h1", content: "text/src", style:{}}
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
