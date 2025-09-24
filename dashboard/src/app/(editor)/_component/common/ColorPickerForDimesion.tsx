import React, { useState, useEffect } from 'react';
import { rgbaToHex, hexToRgba } from './StyleToolbar';
import dimensionStyle from "./dimensionToolbar.module.css"

type ColorPickerWithAlphaProps = {
    label: string;
    value: string;
    onChange: (val: string) => void;
    onLiveChange?: (val: string) => void;
};

const ColorPickerWithAlpha: React.FC<ColorPickerWithAlphaProps> = ({
    label,
    value,
    onChange,
    onLiveChange
}) => {
    const [hexValue, setHexValue] = useState('#ff0000');
    const [alpha, setAlpha] = useState(1);
    const [rgbaValue, setRgbaValue] = useState('rgba(255,0,0,1)');

    // Initialize state from incoming value
    useEffect(() => {
        setRgbaValue(value);
        const match = value.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)/);
        if (match) {
            const [, r, g, b, a] = match;
            setHexValue(rgbaToHex(value));
            setAlpha(parseFloat(a));
        } else {
            setHexValue('#ff0000');
            setAlpha(1);
        }
    }, [value]);

    // Handle hex input change
    const handleHexChange = (hex: string) => {
        setHexValue(hex);
        const rgba = hexToRgba(hex, alpha);
        setRgbaValue(rgba);
        onChange(rgba);
        onLiveChange?.(rgba);
    };

    // Handle alpha slider change
    const handleAlphaChange = (val: number) => {
        setAlpha(val);
        const rgba = hexToRgba(hexValue, val);
        setRgbaValue(rgba);
        onChange(rgba);
        onLiveChange?.(rgba);
    };

    // Handle direct RGBA text input
    const handleRgbaInputChange = (val: string) => {
        setRgbaValue(val);
        const match = val.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)/);
        if (match) {
            const [, r, g, b, a] = match;
            const hex = rgbaToHex(val);
            setHexValue(hex);
            setAlpha(parseFloat(a));
            onChange(val);
            onLiveChange?.(val);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={hexValue}
                    onChange={(e) => handleHexChange(e.target.value)}
                    // className="w-10 h-10 border rounded cursor-pointer"
                    className={`w-10 h-10 border rounded cursor-pointer ${dimensionStyle.colorInput}`}
                />
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={alpha}
                    onChange={(e) => handleAlphaChange(parseFloat(e.target.value))}
                    className="flex-1 accent-stone-600"
                />
                <span className="text-xs w-8 text-right">{alpha.toFixed(2)}</span>
            </div>
            <input
                type="text"
                value={rgbaValue}
                onChange={(e) => handleRgbaInputChange(e.target.value)}
                className="p-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-xs"
            />
        </div>
    );
};

export default ColorPickerWithAlpha;
