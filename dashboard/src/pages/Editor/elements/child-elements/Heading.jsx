import { useRef, useEffect, useState } from "react";
import { useMyContext } from "../../../../Context/ContextApi";

const Heading = ({ element, editable = true, updateContent, style, updateElement, rmElement }) => {
    const elementRef = useRef(null);
    console.log(element)
    const [thisElement, setThisElement] = useState(element)
    console.log("asdfqweqqqq", thisElement)
    const { contextRef, contextElement, toolbarRef } = useMyContext()
    const [isEditing, setEditing] = useState(false)

    useEffect(() => {
        if (elementRef.current && (element.content || element.content === "")) {
            elementRef.current.innerHTML = element.content;
        }
    }, [element.content]);

    console.log(elementRef.current)

    const activateTheEditing = () => {
        console.log(thisElement)
        setEditing(true)
        contextElement.setElementSetter(() => () => setThisElement)
        contextElement.setElement(thisElement)
        contextElement?.setRmElementFunc(() => { return rmElement })
        elementRef.current.style.outline = "1px solid black"
        contextRef.setReference(elementRef)
    }

    const handleBlur = () => {
        const value = elementRef.current.innerHTML;

        setThisElement((prev) => {
            return { ...prev, content: value.trim() }
        })
        // contextRef.clearReference()
    };

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

    useEffect(() => {
        updateContent(element.id, "content", thisElement.content)
    }, [thisElement])

    return (
        <>
            <h1
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

export default Heading;
