import { useRef } from "react";

const Image = ({ element, style }) => {
    const elementRef = useRef();
   
    return (
        <img
            src={element.content || "s"}
            id={element.id}
            ref={elementRef}
            style={style}
            alt={element.alt}
        />
    )
}

export default Image