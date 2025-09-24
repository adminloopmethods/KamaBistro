import { useEffect, useState } from "react";
import { StylesState } from "./DimensionToolbar";
import toolbarStyles from "./dimensionToolbar.module.css";
import { X } from "lucide-react";
import { hexToRgba, rgbaToHex } from "../../_functionality/helperRgbaHex";

export const ColorPickerWithAlpha: React.FC<{
    label: string;
    styleKey: keyof StylesState;
    localStyle: Partial<StylesState>;
    applyStyle: (key: keyof StylesState, val: string | number) => void;
    liveUpdate: (value: string) => void;
}> = ({ label, styleKey, localStyle, applyStyle, liveUpdate }) => {
    const currentValue = localStyle[styleKey] as string;

    const rgbaMatch = currentValue?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    const initialAlpha = rgbaMatch ? parseFloat(rgbaMatch[4] || "1") : 1;
    const initialHex = rgbaMatch ? rgbaToHex(currentValue) : (currentValue || "#000000");

    const [alpha, setAlpha] = useState(initialAlpha);
    const [hexValue, setHexValue] = useState(initialHex);
    const [textValue, setTextValue] = useState(currentValue || `rgba(0,0,0,${initialAlpha})`);

    // sync when external style changes
    useEffect(() => {
        const match = currentValue?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
            const newAlpha = parseFloat(match[4] || "1");
            setAlpha(newAlpha);
            const newHex = rgbaToHex(currentValue);
            setHexValue(newHex);
            setTextValue(currentValue);
        } else {
            setAlpha(1);
            setHexValue("#000000");
            setTextValue(currentValue || "");
        }
    }, [currentValue]);

    const updateAll = (r: number, g: number, b: number, a: number) => {
        const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
        const hex = rgbaToHex(rgba);
        setAlpha(a);
        setHexValue(hex);
        setTextValue(rgba);
        applyStyle(styleKey, rgba);
        liveUpdate(rgba);
    };

    const handleTextChange = (val: string) => {
        setTextValue(val);
        const match = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            const a = parseFloat(match[4] || "1");
            updateAll(r, g, b, a);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
            <div className="flex items-center gap-2 relative">
                {/* Color Input */}
                <input
                    type="color"
                    value={hexValue}
                    onChange={(e) => {
                        const rgba = hexToRgba(e.target.value, alpha);
                        const match = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
                        if (match) {
                            updateAll(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseFloat(match[4]));
                        }
                    }}
                    className={`w-10 h-10 border rounded cursor-pointer ${toolbarStyles.colorInput}`}
                />

                {/* Alpha Slider */}
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={alpha}
                    onChange={(e) => {
                        const newAlpha = parseFloat(e.target.value);
                        const match = textValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
                        if (match) {
                            const r = parseInt(match[1]);
                            const g = parseInt(match[2]);
                            const b = parseInt(match[3]);
                            updateAll(r, g, b, newAlpha);
                        }
                    }}
                    className="flex-1 accent-stone-600"
                />

                <span className="text-xs text-right">{alpha.toFixed(2)}</span>


                {/* Clear Button */}
                <button
                    type="button"
                    onClick={() => applyStyle(styleKey, "")}
                    className="px-1 cursor-pointer py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 absolute -top-3 right-1"
                >
                    <X size={10} />
                </button>
            </div>

            {/* RGBA Text Input */}
            <input
                type="text"
                value={textValue}
                onChange={(e) => handleTextChange(e.target.value)}
                className="border px-1 py-0.5 text-xs rounded w-32"
            />
        </div>
    );
};
