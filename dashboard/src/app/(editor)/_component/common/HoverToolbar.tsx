import { useState, useEffect, useCallback } from "react";
import { useMyContext } from "@/Context/EditorContext";

function HoverTailwindEditor() {
    const [inputString, setString] = useState("");

    const [hoverWidth, setHoverWidth] = useState("");
    const [hoverHeight, setHoverHeight] = useState("");
    const [hoverText, setHoverText] = useState("");
    const [hoverBg, setHoverBg] = useState("");
    const [hoverGradient, setHoverGradient] = useState("");
    const [hoverShadow, setHoverShadow] = useState("");
    const [hoverChild, setHoverChild] = useState("");

    // Extract hover classes from string
    useEffect(() => {
        setHoverWidth((inputString.match(/\bhover:w-[\w-]+/) || [""])[0]);
        setHoverHeight((inputString.match(/\bhover:h-[\w-]+/) || [""])[0]);
        setHoverText((inputString.match(/\bhover:text-[\w-#()]+/) || [""])[0]);
        setHoverBg((inputString.match(/\bhover:bg-[\w-#()]+/) || [""])[0]);
        setHoverGradient(
            (inputString.match(
                /\bhover:bg-gradient-to-[\w]+|hover:from-[\w-#()]+|hover:via-[\w-#()]+|hover:to-[\w-#()]+/g
            ) || []).join(" ")
        );
        setHoverShadow((inputString.match(/\bhover:shadow[\w-]*/) || [""])[0]);
        setHoverChild((inputString.match(/\bgroup-hover:[\w-]+/) || [""])[0]);
    }, [inputString]);

    // Update string when hover states change
    useEffect(() => {
        let newString = inputString
            .replace(/\bhover:[\w-#()]+/g, "")
            .replace(/\bgroup-hover:[\w-]+/g, "")
            .trim();

        const hoverClasses = [
            hoverWidth,
            hoverHeight,
            hoverText,
            hoverBg,
            hoverGradient,
            hoverShadow,
            hoverChild
        ].filter(Boolean).join(" ");

        setString(`${newString} ${hoverClasses}`.trim());
    }, [hoverWidth, hoverHeight, hoverText, hoverBg, hoverGradient, hoverShadow, hoverChild]);

    const renderInput = (label: string, value: string, setValue: (val: string) => void, placeholder: string) => (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
            />
        </div>
    );

    return (
        <div className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 w-[240px] max-w-[20vw] rounded-[4px_4px_0px_0px] border-b-2 border-b-stone-700 shadow-md flex flex-col gap-4 z-[var(--zIndex)]">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 border-b pb-2 mb-2">Hover Classes</h3>

            <div className="grid grid-cols-1 gap-3">
                {renderInput("Width", hoverWidth, setHoverWidth, "hover:w-*")}
                {renderInput("Height", hoverHeight, setHoverHeight, "hover:h-*")}
                {renderInput("Text Color", hoverText, setHoverText, "hover:text-*")}
                {renderInput("Background", hoverBg, setHoverBg, "hover:bg-*")}
                {renderInput("Gradient", hoverGradient, setHoverGradient, "hover:bg-gradient/from/via/to")}
                {renderInput("Shadow", hoverShadow, setHoverShadow, "hover:shadow-*")}
                {renderInput("Child Appear", hoverChild, setHoverChild, "group-hover:*")}
            </div>
        </div>
    );
}

export default HoverTailwindEditor;
