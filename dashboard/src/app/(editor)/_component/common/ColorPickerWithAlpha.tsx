import { useEffect, useState } from "react";
import { StylesState } from "./DimensionToolbar";
import toolbarStyles from "./dimensionToolbar.module.css"
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
    const hexValue = rgbaMatch ? rgbaToHex(currentValue) : (currentValue || "#000000");

    // keep alpha in state so slider moves immediately
    const [alpha, setAlpha] = useState(initialAlpha);

    // sync local alpha when style changes outside
    useEffect(() => {
        if (rgbaMatch) {
            setAlpha(parseFloat(rgbaMatch[4] || "1"));
        } else {
            setAlpha(1);
        }
    }, [currentValue]);

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
                        applyStyle(styleKey, rgba);
                        liveUpdate(rgba);
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
                        setAlpha(newAlpha); // ✅ move thumb instantly

                        let r = 0, g = 0, b = 0;
                        if (rgbaMatch) {
                            r = parseInt(rgbaMatch[1]);
                            g = parseInt(rgbaMatch[2]);
                            b = parseInt(rgbaMatch[3]);
                        } else {
                            const tmp = hexToRgba(hexValue, newAlpha);
                            const m = tmp.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
                            if (m) {
                                r = parseInt(m[1]);
                                g = parseInt(m[2]);
                                b = parseInt(m[3]);
                            }
                        }

                        const rgba = `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
                        applyStyle(styleKey, rgba);
                        liveUpdate(rgba);
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
        </div>
    );
};