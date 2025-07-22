import { useEffect, useRef, useState } from "react";
// import { useMyContext } from "../../Context/ContextApi";
import { mapElement } from "../../functionality/mapElement";
import { useMyContext } from "../../Context/ContextAPI";

const Section = ({ element, style, lastSection, section }) => {
    const [elements, setElements] = useState(element);
    const { contextRef, currentWidth, contextElement, websiteContent, SubmissionObject } = useMyContext();
    const sectionRef = useRef(null)
    const [sectionStyle, setSectionStyle] = useState(style)

    return (
        <section
            ref={sectionRef}
            style={sectionStyle}
        >
            {elements.map((Element, i) => {
                const Component = mapElement[Element.name];
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
    );
};

export default Section;
