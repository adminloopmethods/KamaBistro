import React, { useState, useEffect } from 'react';
import { rgbaToHex, hexToRgba } from './StyleToolbar';
import dimensionStyle from "./dimensionToolbar.module.css"

type ColorPickerWithAlphaProps = {
    label: string;
    value: string;
    onChange: (val: string) => void;
    onLiveChange?: (val: string) => void;
}


const ColorPickerWithDimension: React.FC<ColorPickerWithAlphaProps> = ({ label, value, onChange, onLiveChange }) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Compute alpha and hex dynamically from inputValue
    const alphaMatch = inputValue?.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*(\d?\.?\d+)\)/);
    const alpha = alphaMatch ? parseFloat(alphaMatch[1]) : 1;

    const hex = inputValue?.startsWith("rgba") ? "#" + rgbaToHex(inputValue) : inputValue || "#000000";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        if (val.startsWith("rgba")) {
            onChange(val);
            onLiveChange?.(val);
        } else if (val.startsWith("#")) {
            const rgba = hexToRgba(val, alpha);
            onChange(rgba);
            onLiveChange?.(rgba);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
            <div className="flex items-center gap-2">
                {/* Color Picker */}
                <input
                    type="color"
                    value={hex}
                    onChange={(e) => {
                        const rgba = hexToRgba(e.target.value, alpha);
                        setInputValue(rgba);
                        onChange(rgba);
                        onLiveChange?.(rgba);
                    }}
                    className={`w-10 h-10 border rounded cursor-pointer ${dimensionStyle.colorInput}`}
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
                        const rgba = hexToRgba(hex, newAlpha);
                        setInputValue(rgba);
                        onChange(rgba);
                        onLiveChange?.(rgba);
                    }}
                    className="flex-1 accent-stone-600"
                />
                <span className="text-xs w-8 text-right">{alpha.toFixed(2)}</span>
            </div>

            {/* Text Input */}
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="p-1 border rounded text-xs text-center dark:bg-zinc-800 dark:border-gray-600"
            />
        </div>
    );
};

export default ColorPickerWithDimension