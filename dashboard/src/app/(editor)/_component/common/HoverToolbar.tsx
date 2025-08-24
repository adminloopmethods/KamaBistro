import { useState, useEffect } from "react";
import { useMyContext } from "@/Context/EditorContext";
import { rgbaToHex, hexToRgba } from "./StyleToolbar";

function HoverTailwindEditor() {
    const { hoverObject } = useMyContext();
    const { hoverContext, hoverContextSetter } = hoverObject;

    // Store only values (not full classes)
    const [hoverWidth, setHoverWidth] = useState("");
    const [hoverHeight, setHoverHeight] = useState("");
    const [hoverText, setHoverText] = useState("");
    const [hoverBg, setHoverBg] = useState("");
    const [hoverShadow, setHoverShadow] = useState("");
    const [hoverChild, setHoverChild] = useState("");

    // 🎨 Gradient colors
    const [color1, setColor1] = useState<string>("rgba(255,0,0,1)");
    const [color2, setColor2] = useState<string>("rgba(0,0,255,1)");
    const [gradientDir, setGradientDir] = useState<string>("right");
    const [hoverGradient, setHoverGradient] = useState("");

    // Extract hover classes
    const getHoverClasses = (str: string) =>
        str.trim().length > 0 ? str.trim().split(/\s+/) : [];

    // Parse Tailwind class → value
    const extractValue = (cls: string | undefined, prefix: string) => {
        if (!cls) return "";
        const raw = cls.replace(prefix, "");
        if (raw.startsWith("[") && raw.endsWith("]")) {
            return raw.slice(1, -1); // remove []
        }
        return raw;
    };

    // Build class from value
    const buildClass = (prefix: string, value: string) => {
        if (!value) return "";
        if (value.startsWith("#") || value.startsWith("rgb")) {
            return `${prefix}[${value}]`; // ✅ wrap colors
        }
        if (/^\d+(\w+)?$/.test(value) || value.includes("px") || value.includes("%")) {
            return `${prefix}[${value}]`; // ✅ custom px/em/%
        }
        return `${prefix}${value}`;
    };

    // Extract values when hoverContext changes
    useEffect(() => {
        const classes = getHoverClasses(hoverContext);

        const w = classes.find(c => c.startsWith("hover:!w-"));
        const h = classes.find(c => c.startsWith("hover:!h-"));
        const txt = classes.find(c => c.startsWith("hover:!text-"));
        const bg = classes.find(c => c.startsWith("hover:!bg-") && !c.includes("gradient"));
        const shadow = classes.find(c => c.startsWith("hover:!shadow"));
        const child = classes.find(c => c.startsWith("group-hover:"));

        setHoverWidth(extractValue(w, "hover:!w-"));
        setHoverHeight(extractValue(h, "hover:!h-"));
        setHoverText(extractValue(txt, "hover:!text-"));
        setHoverBg(extractValue(bg, "hover:!bg-"));
        setHoverShadow(extractValue(shadow, "hover:!shadow-"));
        setHoverChild(extractValue(child, "group-hover:"));
    }, [hoverContext]);

    // Rebuild hover string
    useEffect(() => {
        const hoverClasses = [
            buildClass("hover:!w-", hoverWidth),
            buildClass("hover:!h-", hoverHeight),
            buildClass("hover:!text-", hoverText),
            // ✅ only add solid bg if no gradient
            !hoverGradient ? buildClass("hover:!bg-", hoverBg) : "",
            buildClass("hover:!shadow-", hoverShadow),
            buildClass("group-hover:", hoverChild),
            hoverGradient // ✅ gradient always last
        ]
            .filter(Boolean)
            .join(" ");

        if (hoverContextSetter) {
            hoverContextSetter(hoverClasses.trim());
        }
    }, [hoverWidth, hoverHeight, hoverText, hoverBg, hoverShadow, hoverChild, hoverGradient]);

    // 🎨 Update gradient when colors or direction change
    useEffect(() => {
        const gradient = `hover:!bg-gradient-to-${gradientDir} hover:!from-[${color1}] hover:!to-[${color2}]`;
        setHoverGradient(gradient);
    }, [color1, color2, gradientDir]);

    // Small helper for non-color inputs
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
        <div className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 w-[240px] max-w-[22vw] rounded-md shadow-md flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 border-b pb-2 mb-2">
                Hover Classes
            </h3>

            <div className="grid grid-cols-1 gap-3">
                {renderInput("Width", hoverWidth, setHoverWidth, "10px / sm / lg")}
                {renderInput("Height", hoverHeight, setHoverHeight, "10px / sm / lg")}

                {/* 🎨 Text Color with color picker */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Text Color</label>
                    <input
                        type="color"
                        value={hoverText || "#000000"}
                        onChange={e => setHoverText(e.target.value)}
                        className="w-12 h-8 rounded cursor-pointer border"
                    />
                    <input
                        type="text"
                        value={hoverText}
                        onChange={e => setHoverText(e.target.value)}
                        placeholder="#hex or rgba(...)"
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                    />
                </div>

                {/* 🎨 Background Color with color picker */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Background Color</label>
                    <input
                        type="color"
                        value={hoverBg || "#ffffff"}
                        onChange={e => setHoverBg(e.target.value)}
                        className="w-12 h-8 rounded cursor-pointer border"
                        disabled={!!hoverGradient} // ✅ disable if gradient is active
                    />
                    <input
                        type="text"
                        value={hoverBg}
                        onChange={e => setHoverBg(e.target.value)}
                        placeholder="#hex or rgba(...)"
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                        disabled={!!hoverGradient}
                    />
                </div>

                {renderInput("Shadow", hoverShadow, setHoverShadow, "md / lg")}
                {renderInput("Child Appear", hoverChild, setHoverChild, "block / flex")}
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
