import React, { forwardRef, useEffect, useState } from "react";
import { useMyContext } from "@/Context/EditorContext";
import DraggableList from "./Draggables";
import { ElementTypeCustom } from "../Elements/Section";

type Props = {};

const ChildElements = forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { sectionChildElements, sectionChildElementsSetterFull } = useMyContext();

    const [elements, setElements] = useState<ElementTypeCustom[]>(sectionChildElements || [ ])

    useEffect(() => {
        setElements(sectionChildElements || [])
    }, [sectionChildElements])

    if (!elements) return null

    return (
        <div ref={ref} className="p-4 bg-gray-50 shadow-inner min-h-[200px]">
            <DraggableList
                elements={elements}
                setElements={sectionChildElementsSetterFull}
                setVisibleElements={setElements}
                renderItem={(el) => (
                    <div
                        className="p-3 my-2 rounded-xl bg-white shadow-sm border border-gray-200 
                       hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                    >
                        <span className="font-medium text-gray-800">{el.name}</span>
                    </div>
                )}
            />
        </div>
    );
});

ChildElements.displayName = "ChildElements"; // required for forwardRef
export default ChildElements;
