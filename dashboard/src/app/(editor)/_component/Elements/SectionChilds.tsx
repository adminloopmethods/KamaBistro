"use client";

import React, { useState } from "react";
import { screenType, useMyContext } from "@/Context/EditorContext";
import { ElementTypeCustom } from "./Section";


const SectionChilds: React.FC<any> = () => {
    const { sectionChildElements, sectionChildElementsSetter, activeScreen } = useMyContext()
    const [stateOfChildElements, setStateOfChildElements] = useState<ElementTypeCustom[]>(sectionChildElements)

    const handleHideAndSeek = (id: string, checked: boolean) => {
        if (sectionChildElementsSetter) {
            sectionChildElementsSetter(id, checked);


            setStateOfChildElements((prev: ElementTypeCustom[]) =>
                prev.map((e: ElementTypeCustom) =>
                    e.id === id
                        ? {
                            ...e,
                            style: {
                                ...e.style,
                                [activeScreen]: {
                                    ...e.style?.[activeScreen],
                                    display: checked ? "none" : "block",
                                },
                            },
                        }
                        : e
                )
            )
        }
    };

    return (
        <div className="border-t mt-3">
            <label className="text-xs font-medium my-3 inline-block">
                Hide and seek elements
            </label>
            {stateOfChildElements?.map((el: ElementTypeCustom, i: number) => (
                <div key={el.id} className="flex gap-2">
                    <input
                        type="checkbox"
                        onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                            handleHideAndSeek(el.id, ev.target.checked)
                        }
                        checked={el?.style?.[activeScreen]?.display === "none"}
                        id={`hideChild-${i}`}
                    />
                    <label htmlFor={`hideChild-${i}`}>Element {i + 1}</label>
                </div>
            ))}
        </div>
    );
};

export default SectionChilds;
