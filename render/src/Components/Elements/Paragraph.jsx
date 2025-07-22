import { useEffect, useRef } from "react";

const Paragraph = ({ element, style }) => {
    const elementRef = useRef();

    useEffect(() => {
        if (elementRef.current && (element.content || element.content === "")) {
            elementRef.current.innerHTML = element.content;
        }
    }, [element.content]);

    return (
        <p
            id={element.id}
            ref={elementRef}
            style={style}
        />
    )
}

export default Paragraph