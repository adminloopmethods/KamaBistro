import React, { useCallback, useEffect, useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { debounce } from 'lodash';
import { screenType, useMyContext } from '@/Context/EditorContext';
import CustomSelect from '@/app/_common/CustomSelect';
import CopyStylesUI from './CopyStyleUI';

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

const positionOptions = [
    { label: 'Static', value: 'static' },
    { label: 'Relative', value: 'relative' },
    { label: 'Absolute', value: 'absolute' },
];

const alignmentIcons: Record<string, React.FC<any>> = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight,
    justify: AlignJustify,
};

const RichTextToolBar: React.FC = () => {
    const { element, activeScreen, elementSetter, toolbarRef, rmElementFunc, activeRef, screenStyleObj } = useMyContext();
    const Setter = elementSetter;

    // Local style state
    const [localStyle, setLocalStyle] = useState<Partial<StylesState>>(element?.style?.[activeScreen] || {});

    // Sync localStyle with context when element or screen changes
    useEffect(() => {
        setLocalStyle(element?.style?.[activeScreen] || {});
    }, [element, activeScreen]);

    // Apply style (updates local + context)
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

    // Debounced for heavy inputs (colors, slider)
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
    }

    // Generic input renderer
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
                        if (activeRef) {
                            // activeRef.style.setProperty(css, val, "important")
                        }
                    }}
                    onBlur={(e) => {
                        const val = type === 'number' ? `${e.target.value}${suffix || ''}` : e.target.value;
                        // setLocalStyle((prev) => ({ ...prev, [key]: val }));
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
            {/* Bold / Italic / Underline */}
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <button
                        className={`tool-btn font-bold border p-2 px-3 w-[35px] flex justify-center items-center rounded-md ${localStyle.fontWeight && parseInt(localStyle.fontWeight.toString()) >= 500
                            ? 'bg-stone-600 text-white'
                            : ''
                            }`}
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
                        className={`tool-btn italic border p-2 px-3 w-[35px] flex justify-center items-center rounded-md ${localStyle.fontStyle === "italic" ? 'bg-stone-600 text-white' : ''
                            }`}
                        onClick={() => applyStyle("fontStyle", localStyle.fontStyle === "italic" ? "normal" : "italic")}
                    >
                        I
                    </button>
                    <button
                        className={`tool-btn underline border p-2 px-3 w-[35px] flex justify-center items-center rounded-md ${localStyle.textDecoration === "underline" ? 'bg-stone-600 text-white' : ''
                            }`}
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


            {/* Colors */}
            <div className="flex gap-2">
                <input
                    type="color"
                    value={(localStyle.color as string) || "#000000"}
                    onChange={(e) => debouncedApplyStyle("color", e.target.value)}
                    className="w-8 h-8 border rounded cursor-pointer"
                />
                <input
                    type="color"
                    value={(localStyle.backgroundColor as string) || "#000000"}
                    onChange={(e) => debouncedApplyStyle("backgroundColor", e.target.value)}
                    className="w-8 h-8 border rounded cursor-pointer"
                />
            </div>

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
            </div>{/* Position */}{/* Position */}
            {/* <CustomSelect
        options={positionOptions}
        firstOption="position"
        disableFirstValue
        Default={localStyle.position?.toString()}
        onChange={(val) => applyStyle("position", val)}
      /> */}
            {/* {renderInput("Z-Index", "zIndex", "number")}
      {["top", "bottom", "left", "right"].map((key) => renderInput(key, key as keyof StylesState, "text"))} */}
            {/* <CustomSelect
        options={positionOptions}
        firstOption="position"
        disableFirstValue
        Default={localStyle.position?.toString()}
        onChange={(val) => applyStyle("position", val)}
      /> */}
            {/* {renderInput("Z-Index", "zIndex", "number")}
      {["top", "bottom", "left", "right"].map((key) => renderInput(key, key as keyof StylesState, "text"))} */}

            {/* Dimensions */}
            {renderInput("Width", "width", "width")}
            {renderInput("Height", "height", "height")}
            <h4 className="text-xs font-semibold">Padding</h4>
            {[
                {
                    "reactName": "paddingTop",
                    "cssName": "padding-top"
                },
                {
                    "reactName": "paddingBottom",
                    "cssName": "padding-bottom"
                },
                {
                    "reactName": "paddingLeft",
                    "cssName": "padding-left"
                },
                {
                    "reactName": "paddingRight",
                    "cssName": "padding-right"
                }
            ].map(({ reactName, cssName }) => renderInput(reactName, reactName as keyof StylesState, cssName, "number", "px"))}
            <h4 className="text-xs font-semibold">Margin</h4>
            {[
                {
                    "reactName": "marginTop",
                    "cssName": "margin-top"
                },
                {
                    "reactName": "marginBottom",
                    "cssName": "margin-bottom"
                },
                {
                    "reactName": "marginLeft",
                    "cssName": "margin-left"
                },
                {
                    "reactName": "marginRight",
                    "cssName": "margin-right"
                }
            ].map(({ reactName, cssName }) => renderInput(reactName, reactName as keyof StylesState, cssName, "number", "px"))}

            {/* <label htmlFor="" className="text-xs mt-2 font-bold border-t pt-2"> Copy Style from</label>
            <div className="flex gap-2">
                <button className='cursor-pointer border p-2 rounded-md w-[40px] font-bold' onClick={() => { copyTheStyle("xl") }}>
                    XL
                </button>

                <button className='cursor-pointer border p-2 rounded-md w-[40px] font-bold' onClick={() => { copyTheStyle("lg") }}>
                    LG
                </button>
                <button className='cursor-pointer border p-2 rounded-md w-[40px] font-bold' onClick={() => { copyTheStyle("md") }}>
                    MD
                </button>
                <button className='cursor-pointer border p-2 rounded-md w-[40px] font-bold' onClick={() => { copyTheStyle("sm") }}>
                    SM
                </button>
            </div> */}
            <CopyStylesUI copyTheStyle={copyTheStyle} />
        </div>
    );
};

export default RichTextToolBar;