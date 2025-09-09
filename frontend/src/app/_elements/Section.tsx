'use client';

import React, { useRef, useState, CSSProperties, useEffect } from "react";
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
    hover?: { [screen: string]: CSSProperties };
    [key: string]: any;
  };
  activeScreen: string;
  sectionIsParent?: Boolean;
};

const Section: React.FC<SectionProps> = ({
  element,
  style,
  lastSection,
  section,
  sectionIsParent,
  activeScreen,
}) => {
  const { widthSize, editedWidth } = useMyContext();

  const thisStyle = section?.style?.[activeScreen];
  const hover = section?.hover?.[activeScreen] || {};
  const [hoverEffect, setHoverEffect] = useState(false);
  const [elements, setElements] = useState<ElementType[]>(element);
  const [hiddenChildList, setHiddenChildList] = useState<string[]>([]);

  const cleanHover = Object.fromEntries(
    Object.entries(hover).filter(([_, value]) => Boolean(value))
  );

  const sectionRef = useRef<HTMLElement | null>(null);

  const allowHover = activeScreen === "xl" || activeScreen === "lg"

  // Show all hidden children while hovering
  const showAllChildren = () => {
    setElements((prev) =>
      prev.map((e) => {
        if (e.style?.[activeScreen]?.display === "none") {
          setHiddenChildList((prevHidden) => [...prevHidden, e.id]);
          return {
            ...e,
            style: {
              ...e.style,
              [activeScreen]: {
                ...e.style?.[activeScreen],
                display: "block",
              },
            },
          };
        }
        return e;
      })
    );
  };

  // Restore children that were originally hidden
  const hideBackHiddenChildren = () => {
    if (hiddenChildList.length > 0) {
      setElements((prev) =>
        prev.map((e) =>
          hiddenChildList.includes(e.id)
            ? {
              ...e,
              style: {
                ...e.style,
                [activeScreen]: {
                  ...e.style?.[activeScreen],
                  display: "none",
                },
              },
            }
            : e
        )
      );
      setHiddenChildList([]); // reset
    }
  };

  useEffect(() => {
    setElements(element)
  }, [element])

  return (
    <div
      style={{
        position: thisStyle?.position,
        left: style.left || 0,
        top: style.top || 0,
      }}
    >
      <section
        ref={sectionRef}
        style={{
          ...style,
          position: "relative",
          top: 0,
          left: 0,
          overflow: "hidden",
          ...(hoverEffect ? cleanHover : {}),
          transition: ".3s all linear"
        }}
        className=""
        onMouseEnter={() => {
          if (allowHover) {
            setHoverEffect(true);
            showAllChildren();
          }
        }}
        onMouseLeave={() => {
          if (allowHover) {
            setHoverEffect(false);
            hideBackHiddenChildren();
          }
        }}
      >
        {elements.map((Element, i) => {
          if (Element.name === "section") {
            return (
              <Section
                key={i}
                element={Element.elements}
                style={Element?.style?.[activeScreen] || {}}
                activeScreen={activeScreen}
                lastSection={lastSection}
                section={Element}
                sectionIsParent={true}
              />
            );
          }
          const Component = mapElement[Element.name];
          return (
            <Component
              key={i}
              element={Element}
              style={Element.style?.[activeScreen]}
              currentWidth={activeScreen}
            />
          );
        })}
      </section>
    </div>
  );
};

export default React.memo(Section);
