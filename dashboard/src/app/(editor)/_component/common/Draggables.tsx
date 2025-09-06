'use client';

import React, { useRef } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ElementTypeCustom } from "../Elements/Section";


type DraggableListProps = {
    elements: ElementTypeCustom[];
    setElements: React.Dispatch<React.SetStateAction<ElementTypeCustom[]>> | null;
    renderItem: (element: ElementTypeCustom) => React.ReactNode;
};

const ITEM_TYPE = "ELEMENT";

const DraggableItem: React.FC<{
    element: ElementTypeCustom;
    index: number;
    moveItem: (from: number, to: number) => void;
    renderItem: (element: ElementTypeCustom) => React.ReactNode;
}> = ({ element, index, moveItem, renderItem }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
        accept: ITEM_TYPE,
        hover(item: { index: number }) {
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;

            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ITEM_TYPE,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}>
            {renderItem(element)}
        </div>
    );
};

const DraggableList: React.FC<DraggableListProps> = ({ elements, setElements, renderItem }) => {
    const moveItem = (from: number, to: number) => {
        if (!setElements) return
        setElements((prev) => {
            const updated = [...prev];
            const [moved] = updated.splice(from, 1);
            updated.splice(to, 0, moved);
            return updated;
        });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            {elements.map((el, i) => (
                <DraggableItem
                    key={el.id}
                    element={el}
                    index={i}
                    moveItem={moveItem}
                    renderItem={renderItem}
                />
            ))}
        </DndProvider>
    );
};

export default DraggableList;
