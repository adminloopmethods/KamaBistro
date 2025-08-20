import { BaseElement } from "@/functionalities/createElement";
import React, { FocusEvent, useEffect, useRef, useState } from "react";


type HeadingProps = {
    element: BaseElement;
    editable?: boolean;
    style: React.CSSProperties;
    updateContent: (id: string, property: string, value: any) => void;
    updateElement: (id: string, updatedElement: BaseElement) => void;
    rmElement: (id: string) => void;
};

const Division = ({
    element,
    editable = true,
    style,
    updateContent,
    updateElement,
    rmElement,
}: HeadingProps) => {

    const elementRef = useRef<HTMLHeadingElement | null>(null);
    const [divStyle, setDivStyle] = useState<React.CSSProperties>(style);



    return (
        <div
            style={style}
            id={element.id}
            ref={elementRef}
        />
    )
}

export default React.memo(Division)