import { useRef, useState } from "react"

const UnOrderedlist = ({ element, editable, setContent }) => {
    const [elementContent, setElementContent] = useState("");

    const elementRef = useRef(null);

    const handleChange = () => {
        const value = elementRef.current.innerHTML
        setElementContent(value)
    }

    return (
        <ul
            ref={elementRef}
            onInput={handleChange}
            style={element.style}
            dangerouslySetInnerHTML={{ __html: element.content }}
            contentEditable={editable}
        >
            
        </ul>
    )
}

export default UnOrderedlist