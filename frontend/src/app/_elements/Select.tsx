"use client";

import React, {
    useState,
    useEffect,
    useRef,
    RefObject,
} from "react";
import { ChevronDown } from "lucide-react";

type Option = {
    label: string;
    value: string;
    disabele?: Boolean
    onClick?: () => Promise<void>
};

type CustomSelectProps = {
    options: Option[];
    Default?: string;
    onChange?: (value: string) => void;
    disableFirstValue?: boolean;
    firstOption?: string;
    firstValue?: string;
    styleClasses?: string;
    baseClasses?: string;
    addStyleClass?: string;
    addBaseClass?: string;
    listItemClass?: string; // NEW: classes for <li>
    listItemStyle?: React.CSSProperties; // NEW: inline styles
    selectedDisplayClass?: string;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
    options = [],
    Default = "",
    onChange,
    disableFirstValue = false,
    firstOption = "Select an option",
    firstValue = "",
    styleClasses,
    baseClasses,
    addStyleClass = "",
    addBaseClass = "",
    listItemClass = "",
    listItemStyle = {},
    selectedDisplayClass
}) => {
    const [selected, setSelected] = useState<string>(Default || firstValue);
    const [open, setOpen] = useState(false);
    const [dropUp, setDropUp] = useState(false);
    const [dropdownMaxHeight, setDropdownMaxHeight] = useState(240);
    const dropdownRef: RefObject<HTMLDivElement | null> = useRef(null);

    useEffect(() => {
        setSelected(Default || firstValue);
    }, [Default, firstValue]);

    const handleSelect = (value: string, onClick?: () => void, both?: Boolean) => {
        if (both) {
            setSelected(value);
            onClick?.()
            if (onChange) onChange(value);
        } else if (onClick) {
            onClick?.()
        } else {
            setSelected(value);
            if (onChange) onChange(value);
        }


        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                e.target instanceof Node &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getLabel = (val: string) => {
        if (val === firstValue) return firstOption;
        return options.find((opt) => opt.value === val)?.label || firstOption;
    };

    const handleToggle = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            const maxDropdownHeight = 240; // max height in px (15rem)

            if (spaceBelow >= maxDropdownHeight) {
                setDropUp(false);
                setDropdownMaxHeight(maxDropdownHeight);
            } else if (spaceAbove >= maxDropdownHeight) {
                setDropUp(true);
                setDropdownMaxHeight(maxDropdownHeight);
            } else if (spaceBelow > spaceAbove) {
                setDropUp(false);
                setDropdownMaxHeight(spaceBelow - 10); // leave 10px margin
            } else {
                setDropUp(true);
                setDropdownMaxHeight(spaceAbove - 10);
            }
        }
        setOpen((prev) => !prev);
    };

    return (
        <div
            ref={dropdownRef}
            className={
                baseClasses
                    ? baseClasses
                    : `dark:bg-stone-100 relative rounded-3xl h-full flex-[1] ${addBaseClass} `
            }
        >
            <div className="relative">
                <button
                    type="button"
                    onClick={handleToggle}
                    className={
                        styleClasses ||
                        `w-full text-left px-3 py-2 
                        rounded-3xl border border-gray-50 
                        shadow-sm bg-white flex items-center 
                        justify-between focus:outline-none 
                        ${addStyleClass}`
                    }
                >
                    <span
                        className={selectedDisplayClass || (selected === firstValue
                            ? "text-gray-500 dark:text-gray-500"
                            : "text-stone-700 text-sm")}
                    >
                        {getLabel(selected)}
                    </span>
                    <ChevronDown size={18} className="ml-2 text-gray-500" />
                </button>

                {open && (
                    <ul
                        className={`absolute ${dropUp ? "bottom-full mb-1" : "top-full mt-1"} w-full overflow-auto bg-white border border-gray-300 rounded-2xl shadow-lg z-10`}
                        style={{ maxHeight: dropdownMaxHeight }}
                    >
                        {disableFirstValue ? (
                            <li className={`px-3 py-2 text-gray-400 cursor-not-allowed select-none ${listItemClass}`}
                                style={listItemStyle}
                            >
                                {firstOption}
                            </li>
                        ) : (
                            <li
                                onClick={() => handleSelect(firstValue)}
                                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${listItemClass}`}
                                style={listItemStyle}
                            >
                                {firstOption}
                            </li>
                        )}

                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                onClick={() => handleSelect(opt.value, opt.onClick)}
                                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selected === opt.value ? "bg-gray-100 font-medium" : ""
                                    } ${listItemClass}`}
                                style={listItemStyle}
                            >
                                {opt.label}
                            </li>
                        ))}
                    </ul>

                )}
            </div>
        </div>
    );
};

export default CustomSelect;
