import { useEffect, useRef } from "react";

const Heading = ({ element, style }) => {
    const elementRef = useRef();

    useEffect(() => {
        if (elementRef.current && (element.content || element.content === "")) {
            elementRef.current.innerHTML = element.content;
        }
    }, [element.content]);

    return (
        <h1
            id={element.id}
            ref={elementRef}
            style={style}
        />
    )
}

export default Heading