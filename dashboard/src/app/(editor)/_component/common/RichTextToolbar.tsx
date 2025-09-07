import React, { useCallback, useEffect, useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, X } from 'lucide-react';
import { debounce } from 'lodash';
import { screenType, useMyContext } from '@/Context/EditorContext';
import CustomSelect from '@/app/_common/CustomSelect';
import CopyStylesUI from './CopyStyleUI';
import toolbarStyles from "./dimensionToolbar.module.css"
import { ColorPickerWithAlpha } from './ColorPickerWithAlpha';

type StylesState = React.CSSProperties | Record<string, any>;

const fontFamilyOptions = [
    { label: 'Playfair Display', value: 'var(--font-playfair)' },
    { label: 'Poppins', value: 'var(--font-poppins)' },
    // { label: 'System UI', value: 'system-ui' },
    // { label: 'Courier New', value: '"Courier New", monospace' },
    // { label: 'Monospace', value: 'monospace' },
    // { label: 'Serif', value: 'serif' },
];

// ✅ Add options for Display property
const displayOptions = [
    { label: "Block", value: "block" },
    { label: "Inline", value: "inline" },
    { label: "Inline Block", value: "inline-block" },
    { label: "Flex", value: "flex" },
    { label: "Grid", value: "grid" },
    { label: "None", value: "none" },
];


const fontSizeOptions = [12, 14, 16, 18, 20, 22, 24, 32, 36, 40, 48, 54, 64].map(size => ({ // add number to have the font size option
    label: `${size}px`,
    value: `${size}px`
}));

const alignmentIcons: Record<string, React.FC<any>> = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight,
    justify: AlignJustify,
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

    const applyStyleThroughRef = (css: string, value: string): void => {
        if (activeRef) {
            console.log("qwerqwkjhkjqwer")
            activeRef.style.setProperty(css, value, "important")
        }
    }

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

            {/* ✅ Display Property */}
            <CustomSelect
                options={displayOptions}
                firstOption="display"
                disableFirstValue
                Default={localStyle.display?.toString()}
                onChange={(val) => applyStyle("display", val)}
            />

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
            <ColorPickerWithAlpha
                label="Text Color"
                styleKey="color"
                localStyle={localStyle}
                applyStyle={debouncedApplyStyle}
                liveUpdate={(value: string) => applyStyleThroughRef("color", value)}
            />
            <ColorPickerWithAlpha
                label="Background Color"
                styleKey="backgroundColor"
                localStyle={localStyle}
                applyStyle={debouncedApplyStyle}
                liveUpdate={(value: string) => applyStyleThroughRef("background-color", value)}
            />

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

            {/*  Letter Spacing Slider */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                    Letter Spacing
                </label>
                <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={localStyle.letterSpacing ? parseInt(localStyle.letterSpacing.toString()) : 0}
                    onChange={(e) => applyStyle("letterSpacing", `${e.target.value}px`)}
                    className="w-full accent-stone-600"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {localStyle.letterSpacing || "0px"}
                </span>
            </div>

            {/*  Line Height Slider */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                    Line Height
                </label>
                <input
                    type="range"
                    min={1}
                    max={2.5}
                    step={0.1}
                    value={localStyle.lineHeight ? parseFloat(localStyle.lineHeight.toString()) : 1.2}
                    onChange={(e) => applyStyle("lineHeight", e.target.value)}
                    className="w-full accent-stone-600"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {localStyle.lineHeight || "1.2"}
                </span>
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
            <ColorPickerWithAlpha
                label="Border Color"
                styleKey="borderColor"
                localStyle={localStyle}
                applyStyle={debouncedApplyStyle}
                liveUpdate={(value: string) => applyStyleThroughRef("border-color", value)}
            />

            <CopyStylesUI copyTheStyle={copyTheStyle} />
        </div>
    );
};

export default RichTextToolBar;