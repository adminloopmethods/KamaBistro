import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import { useMyContext } from "@/Context/EditorContext";
import ImageSelector from "./ImageSelector";
import CustomSelect from "@/app/_common/CustomSelect";
import { cloudinaryApiPoint } from "@/utils/endpoints";
import { rgbaToHex, hexToRgba } from "./StyleToolbar";
import dimensionStyle from "./dimensionToolbar.module.css";
import SectionChilds from "../Elements/SectionChilds";

// ===== Shadow Presets =====
const shadowPresets: Record<string, string> = {
    none: "none",
    sm: "0 1px 3px rgba(0,0,0,0.1)",
    md: "0 4px 6px rgba(0,0,0,0.2)",
    lg: "0 10px 15px rgba(0,0,0,0.3)",
    xl: "0 20px 25px rgba(0,0,0,0.4)",
    "dark-sm": "0 1px 3px rgba(0,0,0,0.5)",
    "dark-md": "0 4px 6px rgba(0,0,0,0.6)",
    "dark-lg": "0 10px 15px rgba(0,0,0,0.7)",
    "dark-xl": "0 20px 25px rgba(0,0,0,0.85)",
};

// ✅ Reusable Color Picker with Alpha
const ColorPickerWithAlpha: React.FC<{
    label: string;
    value: string;
    onChange: (val: string) => void;
    onLiveChange?: (val: string) => void;
}> = ({ label, value, onChange, onLiveChange }) => {
    const alphaMatch = value?.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*(\d?\.?\d+)\)/);
    const alpha = alphaMatch ? parseFloat(alphaMatch[1]) : 1;
    const hex = value?.startsWith("rgba") ? "#" + rgbaToHex(value) : value || "#000000";

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={hex}
                    onChange={(e) => {
                        const rgba = hexToRgba(e.target.value, alpha);
                        onChange(rgba);
                        onLiveChange?.(rgba);
                    }}
                    className={`w-12 h-8 rounded cursor-pointer border ${dimensionStyle.colorInput}`}
                />
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={alpha}
                    onChange={(e) => {
                        const rgba = hexToRgba(hex, parseFloat(e.target.value));
                        onChange(rgba);
                        onLiveChange?.(rgba);
                    }}
                    className="flex-1 accent-stone-600"
                />
                <span className="text-xs w-8 text-right">{alpha.toFixed(2)}</span>
            </div>
        </div>
    );
};

function HoverToolbar() {
    const { hoverObject, sectionChilds } = useMyContext();
    const { hoverContext, hoverContextSetter } = hoverObject;

    const [hoverText, setHoverText] = useState<string>(
        hoverContext?.color?.toString() || "rgba(0,0,0,1)"
    );
    const [hoverShadow, setHoverShadow] = useState<string>(
        hoverContext?.boxShadow?.toString() || "none"
    );
    const [hoverWidth, setHoverWidth] = useState<string>(
        hoverContext?.width?.toString() || ""
    );
    const [hoverHeight, setHoverHeight] = useState<string>(
        hoverContext?.height?.toString() || ""
    );

    // Background states
    const [color1, setColor1] = useState<string>("rgba(255,0,0,1)");
    const [color2, setColor2] = useState<string>("rgba(0,0,255,1)");
    const [gradientDirection, setGradientDirection] = useState<string>("to right");
    const [gradient, setGradient] = useState<string>("");
    const [bgImage, setBgImage] = useState<string>("");
    const [showImageSelector, setShowImageSelector] = useState<boolean>(false);

    // ===== Debounced update =====
    const debouncedUpdateStyles = useCallback(
        debounce((styles: Record<string, any>) => {
            if (hoverContextSetter) {
                hoverContextSetter({ ...hoverContext, ...styles });
            }
        }, 250),
        [hoverContext, hoverContextSetter]
    );

    const updateBackground = (url?: string, customGradient?: string) => {
        let combined = "";
        const g = customGradient ?? gradient;
        if (g && (bgImage || url)) {
            combined = `${g}, url(${url || bgImage})`;
        } else if (g) {
            combined = g;
        } else if (bgImage || url) {
            combined = `url(${url || bgImage})`;
        }
        debouncedUpdateStyles({ backgroundImage: combined });
    };

    const handleGradientUpdate = (newColor1?: string, newColor2?: string, newDir?: string) => {
        const g = `linear-gradient(${newDir ?? gradientDirection}, ${newColor1 ?? color1}, ${newColor2 ?? color2})`;
        setGradient(g);
        updateBackground(undefined, g);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 w-[240px] max-w-[22vw] rounded-md shadow-md flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 border-b pb-2 mb-2">
                Hover Styles
            </h3>

            {/* Width & Height */}
            <label className='text-xs'>Width</label>
            <input
                type="text"
                placeholder="Width (e.g. 200px / 50%)"
                value={hoverWidth}
                onChange={(e) => {
                    setHoverWidth(e.target.value);
                    debouncedUpdateStyles({ width: e.target.value });
                }}
                className="p-2 rounded-md border bg-white dark:bg-zinc-800 text-sm"
            />
            <label className='text-xs'>Height</label>
            <input
                type="text"
                placeholder="Height (e.g. 100px / auto)"
                value={hoverHeight}
                onChange={(e) => {
                    setHoverHeight(e.target.value);
                    debouncedUpdateStyles({ height: e.target.value });
                }}
                className="p-2 rounded-md border bg-white dark:bg-zinc-800 text-sm"
            />

            {/* Box Shadow */}
            <CustomSelect
                options={Object.entries(shadowPresets).map(([k]) => ({
                    label: k,
                    value: k,
                }))}
                Default={
                    Object.entries(shadowPresets).find(
                        ([, v]) => v === hoverShadow
                    )?.[0] || "none"
                }
                firstOption="Box Shadow"
                disableFirstValue={true}
                onChange={(val) => {
                    setHoverShadow(shadowPresets[val]);
                    debouncedUpdateStyles({ boxShadow: shadowPresets[val] });
                }}
            />

            {/* Text Color */}
            <div className="flex flex-col gap-2 border-t pt-3">
                <ColorPickerWithAlpha
                    label="Text Color"
                    value={hoverText}
                    onChange={(val) => {
                        setHoverText(val);
                        debouncedUpdateStyles({ color: val });
                    }}
                    onLiveChange={(val) => {
                        setHoverText(val);
                        if (hoverContextSetter) hoverContextSetter({ ...hoverContext, color: val });
                    }}
                />
            </div>

            {/* Image Background */}
            <div className="flex flex-col gap-2 border-t pt-3">
                <label className="text-xs font-medium">Image Background</label>
                <button
                    className="text-xs font-medium border p-3 rounded-md"
                    onClick={() => setShowImageSelector(true)}
                >
                    {bgImage ? "Change Background Image" : "Set Background Image"}
                </button>
                <button
                    onClick={() => {
                        setBgImage("");
                        updateBackground("");
                    }}
                    className="px-2 py-1 bg-red-500 text-white text-xs rounded-md"
                >
                    Clear Image
                </button>

                {showImageSelector && (
                    <ImageSelector
                        onSelectImage={(fileInfo: any) => {
                            const url = cloudinaryApiPoint + fileInfo[0];
                            setBgImage(url);
                            updateBackground(url);
                            setShowImageSelector(false);
                        }}
                        onClose={() => setShowImageSelector(false)}
                        type="IMAGE"
                    />
                )}
            </div>

            {/* Gradient Background */}
            <div className="flex flex-col gap-2 border-t pt-3">
                <ColorPickerWithAlpha
                    label="Gradient Color 1"
                    value={color1}
                    onChange={(val) => {
                        setColor1(val);
                        handleGradientUpdate(val, undefined, undefined);
                    }}
                />
                <ColorPickerWithAlpha
                    label="Gradient Color 2"
                    value={color2}
                    onChange={(val) => {
                        setColor2(val);
                        handleGradientUpdate(undefined, val, undefined);
                    }}
                />

                <CustomSelect
                    options={[
                        { label: "Top", value: "to top" },
                        { label: "Right", value: "to right" },
                        { label: "Bottom", value: "to bottom" },
                        { label: "Left", value: "to left" },
                        { label: "Top Right", value: "to top right" },
                        { label: "Bottom Left", value: "to bottom left" },
                    ]}
                    firstOption="Gradient Direction"
                    disableFirstValue={true}
                    Default={gradientDirection}
                    onChange={(val) => {
                        setGradientDirection(val);
                        handleGradientUpdate(undefined, undefined, val);
                    }}
                />

                <button
                    onClick={() => {
                        setGradient("");
                        updateBackground();
                    }}
                    className="px-2 py-1 bg-red-500 text-white text-xs rounded-md"
                >
                    Clear Gradient
                </button>
            </div>

            <SectionChilds />
        </div>
    );
}

export default HoverToolbar;
