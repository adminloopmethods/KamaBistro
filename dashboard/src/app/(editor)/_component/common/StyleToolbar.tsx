import React, { useState, useRef, ChangeEvent, RefObject } from 'react';
// import { getNextZIndex } from '../../../Functionality/globalZIndCounter';
import dimensionStyle from "./dimensionToolbar.module.css";

const shadowPresets: Record<string, string> = {
    none: 'none',
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.2)',
    xl: '0 20px 25px rgba(0,0,0,0.3)',
    "dark-sm": "0 1px 2px rgba(0,0,0,0.5)",
    "dark-md": "0 4px 6px rgba(0,0,0,0.6)",
    "dark-lg": "0 10px 15px rgba(0,0,0,0.7)",
    "dark-xl": "0 20px 25px rgba(0,0,0,0.85)",
};

type StyleToolbarProps = {
    updateStyles: (styles: Record<string, any>) => void;
    rmSection?: (id: string) => void;
};

const StyleToolbar: React.FC<StyleToolbarProps> = ({ updateStyles, rmSection }) => {
    const [color1, setColor1] = useState<string>('rgba(255,0,0,1)');
    const [color2, setColor2] = useState<string>('rgba(0,0,255,1)');
    const [gradientDirection, setGradientDirection] = useState<string>('to right');
    const [bgImageUrl, setBgImageUrl] = useState<string>('');

    const [repeat, setRepeat] = useState<string>('no-repeat');
    const [attachment, setAttachment] = useState<string>('scroll');
    const [size, setSize] = useState<string>('cover');
    const [position, setPosition] = useState<string>('center');
    const [objectFit, setObjectFit] = useState<string>('cover');
    const [fontFamily, setFontFamily] = useState<string>('Arial');
    const [boxShadow, setBoxShadow] = useState<string>('none');

    const [toolbarTop, setToolbarTop] = useState<number>(250);
    const [toolbarLeft, setToolbarLeft] = useState<number>(500);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [zIndex, setZIndex] = useState<number>(500);

    // const handleClick = () => setZIndex(getNextZIndex());

    const applyGradient = () => {
        const gradient = `linear-gradient(${gradientDirection}, ${color1}, ${color2})`;
        updateStyles({ backgroundImage: gradient });
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setBgImageUrl(url);
            updateStyles({ backgroundImage: `url(${url})` });
        }
    };

    const handleShadowChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setBoxShadow(shadowPresets[value]);
        updateStyles({ boxShadow: shadowPresets[value] });
    };

    const renderInputRow = (
        label: string,
        input: React.ReactNode,
        extra: React.ReactNode = null
    ) => (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
            <div className="flex flex-col gap-2">
                {input}
                {extra}
            </div>
        </div>
    );

    return (
        <div
            ref={toolbarRef}
            // onClick={handleClick}
            className=" bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 w-[240px] max-w-[20vw] rounded-md shadow-md flex flex-col gap-4"
            style={{ top: toolbarTop, left: toolbarLeft, zIndex }}
        >
            <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    Advanced Style Controls
                </h3>
            </div>

            {/* Gradient Colors */}
            <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-200">Gradient Colors:</label>
                <div className="flex flex-col gap-3">
                    {[{ color: color1, setColor: setColor1, label: 'Color 1' }, { color: color2, setColor: setColor2, label: 'Color 2' }].map(({ color, setColor, label }, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                            <span className="text-xs font-semibold">{label}</span>
                            <input
                                type="color"
                                value={'#' + rgbaToHex(color)}
                                onChange={(e) => setColor(hexToRgba(e.target.value, 1))}
                                className={dimensionStyle.colorInput}
                            />
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                placeholder="rgba(...)"
                                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {renderInputRow(
                'Gradient Direction',
                <select
                    value={gradientDirection}
                    onChange={(e) => setGradientDirection(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                >
                    <option value="to top">Top</option>
                    <option value="to right">Right</option>
                    <option value="to bottom">Bottom</option>
                    <option value="to left">Left</option>
                    <option value="to top right">Top Right</option>
                    <option value="to bottom left">Bottom Left</option>
                </select>,
                <div className="flex gap-2">
                    <button onClick={applyGradient} className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md">Apply</button>
                    <button onClick={() => updateStyles({ backgroundImage: '' })} className="px-2 py-1 bg-red-500 text-white text-xs rounded-md">Clear</button>
                </div>
            )}

            {renderInputRow(
                'Background Image',
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs"
                />,
                <button onClick={() => updateStyles({ backgroundImage: '' })} className="px-2 py-1 bg-red-500 text-white text-xs rounded-md">Clear</button>
            )}

            {renderInputRow(
                'Repeat',
                <select value={repeat} onChange={(e) => {
                    setRepeat(e.target.value);
                    updateStyles({ backgroundRepeat: e.target.value });
                }} className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm">
                    <option value="no-repeat">No Repeat</option>
                    <option value="repeat">Repeat</option>
                    <option value="repeat-x">Repeat X</option>
                    <option value="repeat-y">Repeat Y</option>
                </select>
            )}

            {renderInputRow(
                'Attachment',
                <select value={attachment} onChange={(e) => {
                    setAttachment(e.target.value);
                    updateStyles({ backgroundAttachment: e.target.value });
                }} className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm">
                    <option value="scroll">Scroll</option>
                    <option value="fixed">Fixed</option>
                    <option value="local">Local</option>
                </select>
            )}

            {renderInputRow(
                'Size',
                <select value={size} onChange={(e) => {
                    setSize(e.target.value);
                    updateStyles({ backgroundSize: e.target.value });
                }} className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm">
                    <option value="auto">Auto</option>
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                </select>
            )}

            {renderInputRow(
                'Position',
                <select value={position} onChange={(e) => {
                    setPosition(e.target.value);
                    updateStyles({ backgroundPosition: e.target.value });
                }} className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm">
                    <option value="center">Center</option>
                    <option value="top left">Top Left</option>
                    <option value="top right">Top Right</option>
                    <option value="bottom left">Bottom Left</option>
                    <option value="bottom right">Bottom Right</option>
                </select>
            )}

            {renderInputRow(
                'Object Fit',
                <select value={objectFit} onChange={(e) => {
                    setObjectFit(e.target.value);
                    updateStyles({ objectFit: e.target.value });
                }} className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm">
                    <option value="fill">Fill</option>
                    <option value="contain">Contain</option>
                    <option value="cover">Cover</option>
                    <option value="none">None</option>
                    <option value="scale-down">Scale Down</option>
                </select>
            )}

            {renderInputRow(
                'Font Family',
                <select
                    value={fontFamily}
                    onChange={(e) => {
                        setFontFamily(e.target.value);
                        updateStyles({ fontFamily: e.target.value });
                    }}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Trebuchet MS">Trebuchet MS</option>
                    <option value="Lucida Console">Lucida Console</option>
                    <option value="Tahoma">Tahoma</option>
                    <option value="Monospace">Monospace</option>
                </select>
            )}

            {renderInputRow(
                'Box Shadow',
                <select
                    onChange={handleShadowChange}
                    value={Object.entries(shadowPresets).find(([key, val]) => val === boxShadow)?.[0] || "none"}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                >
                    <optgroup label="Light Shadows">
                        <option value="none">None</option>
                        <option value="sm">Small</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                        <option value="xl">Extra Large</option>
                    </optgroup>
                    <optgroup label="Dark Shadows">
                        <option value="dark-sm">Dark Small</option>
                        <option value="dark-md">Dark Medium</option>
                        <option value="dark-lg">Dark Large</option>
                        <option value="dark-xl">Dark Extra Large</option>
                    </optgroup>
                </select>
            )}
        </div>
    );
};

export default StyleToolbar;

// === Helper Functions ===
function rgbaToHex(rgba: string): string {
    const match = rgba.match(/\d+(\.\d+)?/g);
    if (!match) return 'ffffff';
    const [r, g, b] = match.map((v, i) => i < 3 ? Number(v).toString(16).padStart(2, '0') : null);
    return `${r}${g}${b}`;
}


function hexToRgba(hex: string, alpha = 1): string {
    const parsed = hex.replace('#', '');
    const bigint = parseInt(parsed, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}