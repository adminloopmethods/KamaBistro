import { useState, useEffect } from "react";
import { useMyContext } from "@/Context/EditorContext";
import { rgbaToHex, hexToRgba } from "./StyleToolbar";

function HoverTailwindEditor() {
    const { hover } = useMyContext();
    const { hoverContext = "", hoverContextSetter } = hover;

    const [hoverWidth, setHoverWidth] = useState("");
    const [hoverHeight, setHoverHeight] = useState("");
    const [hoverText, setHoverText] = useState("");
    const [hoverBg, setHoverBg] = useState("");
    const [hoverGradient, setHoverGradient] = useState("");
    const [hoverShadow, setHoverShadow] = useState("");
    const [hoverChild, setHoverChild] = useState("");

    // 🎨 Gradient colors
    const [color1, setColor1] = useState<string>("rgba(255,0,0,1)");
    const [color2, setColor2] = useState<string>("rgba(0,0,255,1)");
    const [gradientDir, setGradientDir] = useState<string>("right");

    // Convert incoming string → array of classes
    const getHoverClasses = (str: string) =>
        str.trim().length > 0 ? str.trim().split(/\s+/) : [];

    // Extract hover classes into state
    useEffect(() => {
        const classes = getHoverClasses(hoverContext);

        setHoverWidth(classes.find(c => c.startsWith("hover:w-")) || "");
        setHoverHeight(classes.find(c => c.startsWith("hover:h-")) || "");
        setHoverText(classes.find(c => c.startsWith("hover:text-")) || "");
        setHoverBg(
            classes.find(c => c.startsWith("hover:bg-") && !c.includes("gradient")) || ""
        );
        setHoverGradient(
            classes.filter(
                c =>
                    c.startsWith("hover:bg-gradient-to-") ||
                    c.startsWith("hover:from-") ||
                    c.startsWith("hover:via-") ||
                    c.startsWith("hover:to-")
            ).join(" ")
        );
        setHoverShadow(classes.find(c => c.startsWith("hover:shadow")) || "");
        setHoverChild(classes.find(c => c.startsWith("group-hover:")) || "");
    }, [hoverContext]);

    // Rebuild string whenever state changes
    useEffect(() => {
        const hoverClasses = [
            hoverWidth,
            hoverHeight,
            hoverText,
            hoverBg,
            hoverGradient,
            hoverShadow,
            hoverChild
        ]
            .filter(Boolean)
            .join(" ");

        if (hoverContextSetter) {
            hoverContextSetter(hoverClasses.trim());
        }
    }, [hoverWidth, hoverHeight, hoverText, hoverBg, hoverGradient, hoverShadow, hoverChild]);

    // 🎨 Update gradient when colors or direction change
    useEffect(() => {
        const gradient = `hover:bg-gradient-to-${gradientDir} hover:from-[${color1}] hover:to-[${color2}]`;
        setHoverGradient(gradient);
    }, [color1, color2, gradientDir]);

    const renderInput = (
        label: string,
        value: string,
        setValue: (val: string) => void,
        placeholder: string
    ) => (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                {label}
            </label>
            <input
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={placeholder}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
            />
        </div>
    );

    return (
        <div className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 w-[260px] max-w-[20vw] rounded-md shadow-md flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 border-b pb-2 mb-2">
                Hover Classes
            </h3>

            <div className="grid grid-cols-1 gap-3">
                {renderInput("Width", hoverWidth, setHoverWidth, "hover:w-*")}
                {renderInput("Height", hoverHeight, setHoverHeight, "hover:h-*")}
                {renderInput("Text Color", hoverText, setHoverText, "hover:text-*")}
                {renderInput("Background", hoverBg, setHoverBg, "hover:bg-*")}
                {renderInput("Shadow", hoverShadow, setHoverShadow, "hover:shadow-*")}
                {renderInput("Child Appear", hoverChild, setHoverChild, "group-hover:*")}
            </div>

            {/* 🎨 Gradient Colors Section */}
            <div className="flex flex-col gap-2 border-t pt-3">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                    Gradient Colors:
                </label>
                {[{ color: color1, setColor: setColor1, label: "Color 1" }, { color: color2, setColor: setColor2, label: "Color 2" }].map(
                    ({ color, setColor, label }, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                            <span className="text-xs font-semibold">{label}</span>
                            <input
                                type="color"
                                value={"#" + rgbaToHex(color)}
                                onChange={e => {
                                    const newColor = hexToRgba(e.target.value, 1);
                                    setColor(newColor);
                                }}
                                className="w-12 h-8 rounded cursor-pointer border"
                            />
                            <input
                                type="text"
                                value={color}
                                onChange={e => setColor(e.target.value)}
                                placeholder="rgba(...)"
                                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                            />
                        </div>
                    )
                )}

                {/* Gradient Direction */}
                <div className="flex flex-col gap-1 mt-2">
                    <label className="text-xs font-medium">Gradient Direction</label>
                    <select
                        value={gradientDir}
                        onChange={e => setGradientDir(e.target.value)}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                    >
                        <option value="right">to right</option>
                        <option value="left">to left</option>
                        <option value="top">to top</option>
                        <option value="bottom">to bottom</option>
                        <option value="top-right">to top right</option>
                        <option value="bottom-left">to bottom left</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default HoverTailwindEditor;
