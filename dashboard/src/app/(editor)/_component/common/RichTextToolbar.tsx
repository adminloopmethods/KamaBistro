import React, { useCallback, useEffect, useState, ChangeEvent, useRef } from 'react';
// import { useMyContext } from '../../../Context/ContextApi';
import {
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    ChevronDown, ChevronUp
} from 'lucide-react';
import { debounce } from 'lodash';
import { useMyContext } from '@/Context/EditorContext';
import { onAlignChange, onBold, onColorChange, onFamilyFontChange, onItalic, onSizeChange, onUnderline } from '../../_functionality/styleObject';
import CustomSelect from '@/app/_common/CustomSelect';

type Style = Partial<Record<keyof React.CSSProperties, string | number>>;

const fontFamilyOptions = [
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Serif', value: 'serif' },
    { label: 'System UI', value: 'system-ui' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
    { label: 'Monospace', value: 'monospace' }
];
const fontSizeOptions = [
    10, 11, 12, 14, 16, 18, 24, 32, 36, 40, 48, 54, 64
].map(size => ({
    label: `${size} px`,
    value: `${size}px`
}));

const positionOptions = [
    { label: 'Static', value: 'static' },
    { label: 'Relative', value: 'relative' },
];

const RichTextToolBar: React.FC = () => {
    const {
        contextRef,
        activeRef,
        currentWidth,
        elementSetter,
        element,
        toolbarRef,
        rmElementFunc
    } = useMyContext();
    console.log(element)

    const Setter = elementSetter;
    const [textColor, setTextColor] = useState<string>('#000000');
   

    // States for tools
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify' | ''>('');
    const [style, setStyle] = useState<Style>(element?.style?.[currentWidth] || {});

    // Sync when element or screen size changes
    useEffect(() => {
        const st = element?.style?.[currentWidth] || {};
        setStyle(st);

        setIsBold(st.fontWeight === 'bold');
        setIsItalic(st.fontStyle === 'italic');
        setIsUnderline(st.textDecoration === 'underline');
        setAlignment((st.textAlign as any) || '');
        setTextColor((st.color as string) || '#000000');
    }, [element, currentWidth]);

    useEffect(() => {
        if (element?.style?.[currentWidth]) {
            setStyle(element.style[currentWidth]);
        } else {
            setStyle({});
        }
    }, [element, currentWidth]);

    const debouncedColorChange = useCallback(
        debounce((value: string) => {
            onColorChange(value, element, Setter, currentWidth);
        }, 100),
        [element, Setter, currentWidth]
    );

    const valueChangeOfInputs = (
        e: ChangeEvent<HTMLInputElement>,
        key: string,
        isHeight?: boolean
    ) => {
        const val = e.target.value.trim();
        if (isHeight && activeRef?.current?.parentElement) {
            const parent = activeRef.current.parentElement;
            const parentHeight = parent.getBoundingClientRect().height;
            const match = val.match(/^(\d+(?:\.\d+)?)(px|vh|%)$/);
            if (match) {
                const [_, numberStr, unit] = match;
                const num = parseFloat(numberStr);
                let pxValue =
                    unit === 'px'
                        ? num
                        : unit === 'vh'
                            ? (window.innerHeight * num) / 100
                            : unit === '%'
                                ? (parentHeight * num) / 100
                                : Infinity;

                if (pxValue > parentHeight) {
                    alert(`Height can't exceed parent's height of ${Math.floor(parentHeight)}px.`);
                    return;
                }
            }
        }
        setStyle((prev) => ({ ...prev, [key]: val }));
    };

    // Position input handler with mutual exclusivity
    const handlePositionInput = (key: 'top' | 'bottom' | 'left' | 'right', value: string) => {
        setStyle((prev) => {
            const newStyle = { ...prev, [key]: value };

            // Mutual exclusivity: clear opposite property if value is entered
            if (key === 'top' && value) newStyle.bottom = '';
            if (key === 'bottom' && value) newStyle.top = '';
            if (key === 'left' && value) newStyle.right = '';
            if (key === 'right' && value) newStyle.left = '';

            return newStyle;
        });
    };

    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            if (
                toolbarRef.current &&
                !toolbarRef.current?.contains(e.target as Node) &&
                !activeRef.current?.contains(e.target as Node)
            ) {
                contextRef.clearReference();
                if (activeRef.current) {
                    (activeRef.current as HTMLElement).style.outline = 'none';
                }
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [contextRef, toolbarRef, activeRef]);

    useEffect(() => {
        if (Setter) {
            Setter((prev: any) => ({
                ...prev,
                style: { ...prev.style, [currentWidth]: style }
            }));
        }
    }, [style]);

    return (
        <div
            ref={toolbarRef}
            className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 rounded-[0px_0px_1px_1px] w-[240px] max-w-[20vw] shadow-md transition-all duration-100 ease-in-out flex flex-col gap-4 z-[var(--zIndex)]"
        >
            {/* Remove Button */}
            <button
                className="px-3 py-2 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium border border-red-300 dark:bg-red-800 dark:border-red-600 dark:text-red-100"
                onClick={() => rmElementFunc(element.id)}
                title="Remove Element"
            >
                Remove This Element
            </button>

            <h3 className="tool-btn w-full flex items-center justify-between border-t pt-2 font-bold">
                Style
            </h3>

            {/* Bold, Italic, Underline */}
            <div className="flex gap-2">
                <button className={`tool-btn font-bold border p-1 min-w-[30px] rounded-md shadow-sm ${isBold && "bg-stone-600 text-white"}`} onClick={() => onBold(element, Setter, currentWidth)}>B</button>
                <button className={`tool-btn italic border p-1 min-w-[30px] rounded-md shadow-sm ${isItalic && "bg-stone-600 text-white"}`} onClick={() => onItalic(element, Setter, currentWidth)}>I</button>
                <button className={`tool-btn underline border p-1 min-w-[30px] rounded-md shadow-sm ${isUnderline && "bg-stone-600 text-white"}`} onClick={() => onUnderline(element, Setter, currentWidth)}>U</button>
            </div>

            {/* Font & Size */}
            <CustomSelect
                options={fontFamilyOptions}
                Default={style.fontFamily?.toString() || undefined}
                firstOption="fonts"
                onChange={(value: string) => { onFamilyFontChange(value, element, Setter, currentWidth); }}
                disableFirstValue={true}
            />

            <CustomSelect
                options={fontSizeOptions}
                firstOption="text size"
                Default={style.fontSize?.toString() || undefined}
                onChange={(value: string) => { onSizeChange(value, element, Setter, currentWidth); }}
                disableFirstValue={true}
            />

            {/* Color Picker */}
            <input
                type="color"
                value={textColor}
                onChange={(e) => {
                    setTextColor(e.target.value);
                    debouncedColorChange(e.target.value);
                }}
                className="w-8 h-8 border border-gray-300 dark:border-gray-700 rounded cursor-pointer"
                title="Text color"
            />

            {/* Align */}
            <div className="flex gap-2">
                <button className={`tool-btn border p-1 rounded-md shadow-sm ${alignment === "left" && "bg-stone-600 text-white"}`} onClick={() => onAlignChange("left", element, Setter, currentWidth)} title="Align Left"><AlignLeft /></button>
                <button className={`tool-btn border p-1 rounded-md shadow-sm ${alignment === "center" && "bg-stone-600 text-white"}`} onClick={() => onAlignChange("center", element, Setter, currentWidth)} title="Align Center"><AlignCenter /></button>
                <button className={`tool-btn border p-1 rounded-md shadow-sm ${alignment === "right" && "bg-stone-600 text-white"}`} onClick={() => onAlignChange("right", element, Setter, currentWidth)} title="Align Right"><AlignRight /></button>
                <button className={`tool-btn border p-1 rounded-md shadow-sm ${alignment === "justify" && "bg-stone-600 text-white"}`} onClick={() => onAlignChange("justify", element, Setter, currentWidth)} title="Justify"><AlignJustify /></button>
            </div>

            {/* Position & Z-Index */}
            <CustomSelect
                options={positionOptions}
                firstOption="position"
                Default={style.position?.toString() || undefined}
                onChange={(value: string) => {
                    setStyle(prev => ({ ...prev, position: value, zIndex: 1 }));
                }}
                disableFirstValue={true}
            />
            <input
                type="number"
                placeholder="z-index"
                value={style.zIndex?.toString() || ''}
                onChange={(e) => setStyle(prev => ({ ...prev, zIndex: parseInt(e.target.value) || 0 }))}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm w-full"
            />

            {/* Top/Bottom/Left/Right */}
            <div className="grid grid-cols-2 gap-2">
                <input
                    type="text"
                    placeholder="top"
                    value={style.top?.toString() || ''}
                    onChange={(e) => handlePositionInput('top', e.target.value)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                />
                <input
                    type="text"
                    placeholder="bottom"
                    value={style.bottom?.toString() || ''}
                    onChange={(e) => handlePositionInput('bottom', e.target.value)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                />
                <input
                    type="text"
                    placeholder="left"
                    value={style.left?.toString() || ''}
                    onChange={(e) => handlePositionInput('left', e.target.value)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                />
                <input
                    type="text"
                    placeholder="right"
                    value={style.right?.toString() || ''}
                    onChange={(e) => handlePositionInput('right', e.target.value)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                />
            </div>

            {/* Dimensions */}
            <h3 className="tool-btn w-full flex items-center justify-between border-t pt-2 font-bold">
                Dimensions
            </h3>

            <div className={`transition-all duration-300 grid grid-cols-2 gap-2 overflow-hidden`}>
                {[
                    'width', 'height',
                    'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
                    'marginLeft', 'marginRight', 'marginTop', 'marginBottom'
                ].map(key => {
                    const isHeight = key === 'height';
                    return (
                        <input
                            key={key}
                            type="text"
                            placeholder={key}
                            value={style[key as keyof React.CSSProperties] || ''}
                            onChange={(e) => valueChangeOfInputs(e, key, isHeight)}
                            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm w-full"
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default RichTextToolBar;














 // const [parentElement, setParentElement] = useState<HTMLElement | null>(null)

    // useEffect(() => {
    //     if (activeRef) {
    //         setParentElement(activeRef.parentElement);
    //     }
    // }, [activeRef]);