import React, { forwardRef } from "react";
import { useMyContext } from "@/Context/EditorContext"
import DraggableList from "./Draggables"

type Props = {}

const ChildElements = forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { sectionChildElements, sectionChildElementsSetterFull } = useMyContext()

    return (
        <div ref={ref}>
            <DraggableList
                elements={sectionChildElements}
                setElements={sectionChildElementsSetterFull}
                renderItem={(el) => (
                    <div style={{ padding: "10px", border: "1px solid gray", margin: "4px" }}>
                        {el.name}
                    </div>
                )}
            />
        </div>
    )
});

ChildElements.displayName = "ChildElements"; // required for forwardRef
export default ChildElements;
