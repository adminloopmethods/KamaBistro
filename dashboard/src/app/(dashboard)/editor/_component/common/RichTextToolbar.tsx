import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
// import { useMyContext } from '../../../Context/ContextApi';
import {
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    ChevronDown, ChevronUp
} from 'lucide-react';
import { debounce } from 'lodash';
import { useMyContext } from '@/Context/EditorContext';
import { onAlignChange, onBold, onColorChange, onFamilyFontChange, onItalic, onSizeChange, onUnderline } from '../../_functionality/styleObject';
import CustomSelect from '@/app/_common/CustomSelect';

type Dimension = {
    width?: string;
    height?: string;
    paddingLeft?: string;
    paddingRight?: string;
    paddingTop?: string;
    paddingBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    marginTop?: string;
    marginBottom?: string;
    [key: string]: string | undefined;
};

const fontFamilyOptions = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Serif', value: 'serif' },
    { label: 'System UI', value: 'system-ui' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
    { label: 'Tahoma', value: 'Tahoma, sans-serif' },
    { label: 'Monospace', value: 'monospace' }
];
const fontSizeOptions = [
    { label: '10 px', value: '10px' },
    { label: '11 px', value: '11px' },
    { label: '12 px', value: '12px' },
    { label: '14 px', value: '14px' },
    { label: '16 px', value: '16px' },
    { label: '18 px', value: '18px' },
    { label: '24 px', value: '24px' },
    { label: '32 px', value: '32px' },
    { label: '36 px', value: '36px' },
    { label: '40 px', value: '40px' },
    { label: '48 px', value: '48px' },
    { label: '54 px', value: '54px' },
    { label: '64 px', value: '64px' },
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

    const Setter = elementSetter?.();
    const [isDimensionOpen, setIsDimensionOpen] = useState<boolean>(false);
    const [textColor, setTextColor] = useState<string>('#000000');
    const [zIndex, setZIndex] = useState<number>(500);

    const [dimension, setDimension] = useState<Dimension>({
        width: element?.style?.[currentWidth]?.width || '',
        height: element?.style?.[currentWidth]?.height || '',
        paddingLeft: element?.style?.[currentWidth]?.paddingLeft || '',
        paddingRight: element?.style?.[currentWidth]?.paddingRight || '',
        paddingTop: element?.style?.[currentWidth]?.paddingTop || '',
        paddingBottom: element?.style?.[currentWidth]?.paddingBottom || '',
        marginLeft: element?.style?.[currentWidth]?.marginLeft || '',
        marginRight: element?.style?.[currentWidth]?.marginRight || '',
        marginTop: element?.style?.[currentWidth]?.marginTop || '',
        marginBottom: element?.style?.[currentWidth]?.marginBottom || '',
    });

    // const handleClick = () => setZIndex(getNextZIndex());

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
        setDimension((prev) => ({ ...prev, [key]: val }));
    };

    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            if (
                toolbarRef.current &&
                !toolbarRef.current.contains(e.target as Node) &&
                !activeRef.current.contains(e.target as Node)
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
                style: { ...prev.style, [currentWidth]: dimension }
            }));
        }
    }, [dimension]);

    return (
        <div
            ref={toolbarRef}
            // onClick={handleClick}
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

            {/* Bold, Italic, Underline */}
            <div className="flex gap-2">
                <button className="tool-btn font-bold border p-1 min-w-[30px] rounded-md shadow-sm" onClick={() => onBold(element, Setter, currentWidth)}>B</button>
                <button className="tool-btn italic border p-1 min-w-[30px] rounded-md shadow-sm" onClick={() => onItalic(element, Setter, currentWidth)}>I</button>
                <button className="tool-btn underline border p-1 min-w-[30px] rounded-md shadow-sm" onClick={() => onUnderline(element, Setter, currentWidth)}>U</button>
            </div>

            {/* Font & Size */}
            <CustomSelect
                options={fontFamilyOptions}
                Default=""
                firstOption="fonts"
                onChange={(value: string) => { onFamilyFontChange(value, element, Setter, currentWidth); }}
                disableFirstValue={true}
            />

            <CustomSelect
                options={fontSizeOptions}
                firstOption="text size"
                Default=""
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
                <button className="tool-btn border p-1 rounded-md shadow-sm" onClick={() => onAlignChange("left", element, Setter, currentWidth)} title="Align Left"><AlignLeft /></button>
                <button className="tool-btn border p-1 rounded-md shadow-sm" onClick={() => onAlignChange("center", element, Setter, currentWidth)} title="Align Center"><AlignCenter /></button>
                <button className="tool-btn border p-1 rounded-md shadow-sm" onClick={() => onAlignChange("right", element, Setter, currentWidth)} title="Align Right"><AlignRight /></button>
                <button className="tool-btn border p-1 rounded-md shadow-sm" onClick={() => onAlignChange("justify", element, Setter, currentWidth)} title="Justify"><AlignJustify /></button>
            </div>

            {/* Toggle Dimensions */}
            <button
                className="tool-btn w-full flex items-center justify-between border-t pt-2"
                onClick={() => setIsDimensionOpen(!isDimensionOpen)}
                title={isDimensionOpen ? 'Hide Dimensions' : 'Show Dimensions'}
            >
                Dimensions {isDimensionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Dimension Inputs */}
            <div className={`transition-all duration-300 grid grid-cols-2 gap-2 overflow-hidden ${isDimensionOpen ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}>
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
                            value={dimension[key] || ''}
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