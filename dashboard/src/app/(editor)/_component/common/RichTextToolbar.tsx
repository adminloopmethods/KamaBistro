import React, { useCallback, useEffect, useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, X } from 'lucide-react';
import { debounce } from 'lodash';
import { screenType, useMyContext } from '@/Context/EditorContext';
import CustomSelect from '@/app/_common/CustomSelect';
import CopyStylesUI from './CopyStyleUI';
import toolbarStyles from "./dimensionToolbar.module.css"

type StylesState = React.CSSProperties | Record<string, any>;

const fontFamilyOptions = [
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Serif', value: 'serif' },
    { label: 'System UI', value: 'system-ui' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
    { label: 'Monospace', value: 'monospace' },
    { label: 'Poppins', value: 'var(--font-poppins)' },
    { label: 'Playfair Display', value: 'var(--font-playfair)' },
];

const fontSizeOptions = [12, 14, 16, 18, 24, 32, 36, 40, 48, 54, 64].map(size => ({
    label: `${size}px`,
    value: `${size}px`
}));

const alignmentIcons: Record<string, React.FC<any>> = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight,
    justify: AlignJustify,
};

// ✅ helper: hex → rgba
function hexToRgba(hex: string, alpha: number = 1): string {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ✅ reusable component for color + alpha
export const ColorPickerWithAlpha: React.FC<{
    label: string;
    styleKey: keyof StylesState;
    localStyle: Partial<StylesState>;
    applyStyle: (key: keyof StylesState, val: string | number) => void;
}> = ({ label, styleKey, localStyle, applyStyle }) => {
    const currentValue = localStyle[styleKey] as string;

    // extract alpha if rgba, otherwise default 1
    const alphaMatch = currentValue?.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*(\d?\.?\d+)\)/);
    const alpha = alphaMatch ? parseFloat(alphaMatch[1]) : 1;

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
            <div className="flex items-center gap-2 relative">
                {/* Color Input */}
                <input
                    type="color"
                    value={
                        currentValue?.startsWith("rgba")
                            ? "#000000"
                            : currentValue || "#000000"
                    }
                    onChange={(e) => {
                        const rgba = hexToRgba(e.target.value, alpha);
                        applyStyle(styleKey, rgba);
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
                        const baseHex = currentValue?.startsWith("rgba")
                            ? "#000000"
                            : currentValue || "#000000";
                        const rgba = hexToRgba(baseHex, parseFloat(e.target.value));
                        applyStyle(styleKey, rgba);
                    }}
                    className={`flex-1 accent-stone-600 `}
                />

                <span className="text-xs text-right">{alpha}</span>

                {/* ✅ Clear Button */}
                <button
                    type="button"
                    onClick={() => applyStyle(styleKey, "")}
                    className="px-1 cursor-pointer py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 absolute -top-3 right-1"
                >
                    <X size={10}/>
                </button>
            </div>
        </div>
    );
};


const RichTextToolBar: React.FC = () => {
    const { element, activeScreen, elementSetter, toolbarRef, rmElementFunc, activeRef, screenStyleObj } = useMyContext();
    const Setter = elementSetter;

    const [localStyle, setLocalStyle] = useState<Partial<StylesState>>(element?.style?.[activeScreen] || {});

    useEffect(() => {
        setLocalStyle(element?.style?.[activeScreen] || {});
    }, [element, activeScreen]);

    const applyStyle = useCallback(
        (key: keyof StylesState, val: string | number) => {
            const newStyle = { ...localStyle, [key]: val };
            setLocalStyle(newStyle);
            Setter?.((prev: any) => ({
                ...prev,
                style: { ...prev.style, [activeScreen]: newStyle },
            }));
        },
        [localStyle, Setter, activeScreen]
    );

    const debouncedApplyStyle = useCallback(
        debounce((key: keyof StylesState, val: string | number) => applyStyle(key, val), 300),
        [applyStyle]
    );

    const copyTheStyle = (screenSize: screenType) => {
        if (screenStyleObj.screenStyles?.[screenSize]) {
            Setter?.((prev: any) => ({
                ...prev,
                style: { ...prev.style, [activeScreen]: screenStyleObj.screenStyles?.[screenSize] },
            }))
        }
    };

    const renderInput = (
        label: string,
        key: keyof StylesState,
        css: string,
        type: 'text' | 'number' = 'text',
        suffix?: string
    ) => {
        let value: string | number | undefined = localStyle?.[key];
        if (type === 'number' && typeof value === 'string') value = parseFloat(value);

        return (
            <div className="flex flex-col gap-1" key={key}>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
                <input
                    type={type}
                    value={value || ""}
                    onChange={(e) => {
                        const val = type === 'number' ? `${e.target.value}${suffix || ''}` : e.target.value;
                        applyStyle(key, val);
                    }}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                />
            </div>
        );
    };

    return (
        <div
            ref={toolbarRef}
            className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 rounded-md w-[240px] max-w-[20vw] shadow-md flex flex-col gap-4 z-[var(--zIndex)]"
        >
            {/* Remove */}
            <button
                onClick={() => rmElementFunc(element.id)}
                className="px-3 py-2 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium border border-red-300 dark:bg-red-800 dark:border-red-600 dark:text-red-100"
            >
                Remove Element
            </button>

            {/* Font Family / Size */}
            <CustomSelect
                options={fontFamilyOptions}
                firstOption="fonts"
                disableFirstValue
                Default={localStyle.fontFamily?.toString()}
                onChange={(val) => applyStyle("fontFamily", val)}
            />
            <CustomSelect
                options={fontSizeOptions}
                firstOption="text size"
                disableFirstValue
                Default={localStyle.fontSize?.toString()}
                onChange={(val) => applyStyle("fontSize", val)}
            />

            {/* Bold / Italic / Underline */}
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <button
                        className={`tool-btn font-bold border p-2 px-3 w-[35px] flex justify-center items-center rounded-md ${localStyle.fontWeight && parseInt(localStyle.fontWeight.toString()) >= 500 ? 'bg-stone-600 text-white' : ''}`}
                        onClick={() =>
                            applyStyle(
                                "fontWeight",
                                localStyle.fontWeight && parseInt(localStyle.fontWeight.toString()) >= 500 ? "400" : "700"
                            )
                        }
                    >
                        B
                    </button>
                    <button
                        className={`tool-btn italic border p-2 px-3 w-[35px] flex justify-center items-center rounded-md ${localStyle.fontStyle === "italic" ? 'bg-stone-600 text-white' : ''}`}
                        onClick={() => applyStyle("fontStyle", localStyle.fontStyle === "italic" ? "normal" : "italic")}
                    >
                        I
                    </button>
                    <button
                        className={`tool-btn underline border p-2 px-3 w-[35px] flex justify-center items-center rounded-md ${localStyle.textDecoration === "underline" ? 'bg-stone-600 text-white' : ''}`}
                        onClick={() =>
                            applyStyle("textDecoration", localStyle.textDecoration === "underline" ? "none" : "underline")
                        }
                    >
                        U
                    </button>
                </div>

                {/* Font Weight Slider */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-200">Font Weight</label>
                    <input
                        type="range"
                        min={100}
                        max={900}
                        step={100}
                        value={localStyle.fontWeight ? parseInt(localStyle.fontWeight.toString()) : 400}
                        onChange={(e) => applyStyle("fontWeight", e.target.value)}
                        className="w-full accent-stone-600"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {localStyle.fontWeight || 400}
                    </span>
                </div>
            </div>

            {/* ✅ Colors with Alpha */}
            <ColorPickerWithAlpha label="Text Color" styleKey="color" localStyle={localStyle} applyStyle={applyStyle} />
            <ColorPickerWithAlpha label="Background Color" styleKey="backgroundColor" localStyle={localStyle} applyStyle={applyStyle} />

            {/* Alignment */}
            <div className="flex gap-2">
                {Object.entries(alignmentIcons).map(([align, Icon]) => (
                    <button
                        key={align}
                        className={`tool-btn border p-1 rounded-md ${localStyle.textAlign === align ? 'bg-stone-600 text-white' : ''}`}
                        onClick={() => applyStyle("textAlign", align)}
                    >
                        <Icon />
                    </button>
                ))}
            </div>

            {/* Dimensions */}
            {renderInput("Width", "width", "width")}
            {renderInput("Height", "height", "height")}

            {/* Padding */}
            <h4 className="text-xs font-semibold">Padding</h4>
            {["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"].map((key) =>
                renderInput(key, key as keyof StylesState, key, "number", "px")
            )}

            {/* Margin */}
            <h4 className="text-xs font-semibold">Margin</h4>
            {["marginTop", "marginBottom", "marginLeft", "marginRight"].map((key) =>
                renderInput(key, key as keyof StylesState, key, "number", "px")
            )}

            {/* Border */}
            <h4 className="text-xs font-semibold mt-2">Border</h4>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-200">Border Width</label>
                <input
                    type="number"
                    value={parseInt(localStyle.borderWidth?.toString() || "0")}
                    onChange={(e) => applyStyle("borderWidth", `${e.target.value}px`)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                />
            </div>

            {/* ✅ Border Color with Alpha */}
            <ColorPickerWithAlpha label="Border Color" styleKey="borderColor" localStyle={localStyle} applyStyle={applyStyle} />

            <CopyStylesUI copyTheStyle={copyTheStyle} />
        </div>
    );
};

export default RichTextToolBar;
