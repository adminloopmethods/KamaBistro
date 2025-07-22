import { useRef, useEffect, useState } from "react";
import { useMyContext } from "../../../Context/ContextApi";

const Paragraph = ({ element, editable = true, updateContent, style, updateElement, rmElement }) => {
    const elementRef = useRef(null);
    const [content, setContent] = useState("New Heading")
    const [thisElement, setThisElement] = useState(element)
    const { contextRef, contextElement, toolbarRef } = useMyContext()
    const [isEditing, setEditing] = useState(false)

    useEffect(() => {
        if (elementRef.current && (element.content || element.content === "")) {
            elementRef.current.innerHTML = element.content || content;
        }
    }, [element.content]);

    const handleBlur = () => {
        const value = elementRef.current.innerHTML;
        if (setContent) { setContent(value); }
        updateContent(element.id, "content", value)
    };

    const activateTheEditing = () => {
        setEditing(true)
        contextElement.setElementSetter(() => () => setThisElement)
        contextElement.setElement(thisElement)
        elementRef.current.style.outline = "1px solid black"
        contextRef.setReference(elementRef)
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                (toolbarRef.current &&
                    !toolbarRef.current.contains(e.target)) &&
                (elementRef.current &&
                    !elementRef.current.contains(e.target))
            ) {
                // contextRef.clearReference();
                elementRef.current.style.outline = "none"
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [contextRef]);

    useEffect(() => {
        if (isEditing) {
            contextElement.setElement(thisElement)
        }
        updateElement(element.id, thisElement)

    }, [thisElement.style])

    return (
        <>
            <p
                id={element.id}
                ref={elementRef}
                onBlur={handleBlur}
                contentEditable={editable}
                suppressContentEditableWarning={true}
                style={style}
                onFocus={activateTheEditing}
            />
        </>
    );
};

export default Paragraph;
