"use client";

import React, { useRef } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SectionElementType } from "../../_functionality/createSection";

const ITEM_TYPE = "SECTION";

type DraggableSectionsProps = {
  sections: SectionElementType[];
  setSections: React.Dispatch<React.SetStateAction<SectionElementType[]>>;
  renderItem: (section: SectionElementType, index: number) => React.ReactNode;
};

const DraggableSection: React.FC<{
  section: SectionElementType;
  index: number;
  moveItem: (from: number, to: number) => void;
  renderItem: (section: SectionElementType, index: number) => React.ReactNode;
}> = ({ section, index, moveItem, renderItem }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(item: { index: number }, monitor) {
      const dragIndex = item.index;
      const hoverIndex = index;

      if (!ref.current || dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

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
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      {renderItem(section, index)}
    </div>
  );
};

const DraggableSections: React.FC<DraggableSectionsProps> = ({
  sections,
  setSections,
  renderItem,
}) => {
  const moveItem = (from: number, to: number) => {
    setSections((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {sections.map((section, i) => (
        <DraggableSection
          key={section.id}
          section={section}
          index={i}
          moveItem={moveItem}
          renderItem={renderItem}
        />
      ))}
    </DndProvider>
  );
};

export default DraggableSections;
