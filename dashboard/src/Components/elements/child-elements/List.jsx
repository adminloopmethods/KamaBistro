import { useRef, useState } from "react"

const List = ({ element, editable, setContent }) => {
    const [elementContent, setElementContent] = useState("");

    const elementRef = useRef(null);

    const handleChange = () => {
        const value = elementRef.current.innerHTML
        setElementContent(value)
    }

    return (
        <li
            ref={elementRef}
            onInput={handleChange}
            style={element.style}
            dangerouslySetInnerHTML={{ __html: element.content }}
            contentEditable={editable}
        >
            
        </li>
    )
}

export default List