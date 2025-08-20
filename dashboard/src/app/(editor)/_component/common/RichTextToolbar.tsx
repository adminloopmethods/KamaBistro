import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import {
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
} from 'lucide-react';
import { debounce } from 'lodash';
import { useMyContext } from '@/Context/EditorContext';
import {
    onAlignChange, onBgColorChange, onBold, onColorChange, onFamilyFontChange,
    onItalic, onSizeChange, onUnderline
} from '../../_functionality/styleObject';
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
].map(size => ({ label: `${size}px`, value: `${size}px` }));

const positionOptions = [
    { label: 'Static', value: 'static' },
    { label: 'Relative', value: 'relative' },
    { label: 'Absolute', value: 'absolute' },
];

const alignmentIcons: Record<string, React.FC<any>> = {
    left: AlignLeft,
    center: AlignCenter,
    right: AlignRight,
    justify: AlignJustify
};


const RichTextToolBar: React.FC = () => {
    const { contextRef, activeRef, activeScreen, elementSetter, element, toolbarRef, rmElementFunc } = useMyContext();

    const Setter = elementSetter;

    const [style, setStyle] = useState<Style>(element?.style?.[activeScreen] || {});
    const [letterSpacing, setLetterSpacing] = useState<number>(parseFloat(element?.style?.[activeScreen].letterSpacing) || 0)
    const [textColor, setTextColor] = useState<string>('#000000');
    const [bgColor, setBgColor] = useState<string>('#000000');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify' | ''>('');

    // Sync style when element or screen changes
    useEffect(() => {
        const st = element?.style?.[activeScreen] || {};
        setStyle(st);
        setIsBold(st.fontWeight === 'bold');
        setIsItalic(st.fontStyle === 'italic');
        setIsUnderline(st.textDecoration === 'underline');
        setAlignment((st.textAlign as any) || '');
        setTextColor((st.color as string) || '#000000');
        setBgColor((st.backgroundColor as string) || '#000000');
    }, [element, activeScreen]);

    // Update element style whenever `style` changes
    useEffect(() => {
        Setter?.((prev: any) => ({
            ...prev,
            style: { ...prev.style, [activeScreen]: style }
        }));
    }, [style, Setter, activeScreen]);

    // Handle clicks outside toolbar
    useEffect(() => {
        const handlePointerDown = (e: PointerEvent) => {
            if (!toolbarRef.current?.contains(e.target as Node) && !activeRef.current?.contains(e.target as Node)) {
                contextRef.clearReference();
                if (activeRef.current) (activeRef.current as HTMLElement).style.outline = 'none';
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [contextRef, toolbarRef, activeRef]);

    // Debounced color change
    const debouncedColorChange = useCallback(
        debounce((key: string, value: string) => {
            if (key === "bg") {
                onBgColorChange(value, element, Setter, activeScreen)
            } else {
                onColorChange(value, element, Setter, activeScreen)
            }
        }, 500),
        [element, Setter, activeScreen]
    );

    // Generic input handler
    const handleInputChange = (key: keyof React.CSSProperties, value: string, isHeight = false) => {
        if (isHeight && activeRef?.current?.parentElement) {
            const parentHeight = activeRef.current.parentElement.getBoundingClientRect().height;
            const match = value.match(/^(\d+(?:\.\d+)?)(px|vh|%)$/);
            if (match) {
                const [_, numStr, unit] = match;
                const num = parseFloat(numStr);
                const pxValue = unit === 'px' ? num : unit === 'vh' ? (window.innerHeight * num) / 100 : (parentHeight * num) / 100;
                if (pxValue > parentHeight) return alert(`Height can't exceed parent's height of ${Math.floor(parentHeight)}px.`);
            }
        }
        setStyle(prev => ({ ...prev, [key]: value }));
    };

    const handlePositionInput = (key: 'top' | 'bottom' | 'left' | 'right', value: string) => {
        setStyle(prev => {
            const newStyle = { ...prev, [key]: value };
            if (key === 'top' && value) newStyle.bottom = '';
            if (key === 'bottom' && value) newStyle.top = '';
            if (key === 'left' && value) newStyle.right = '';
            if (key === 'right' && value) newStyle.left = '';
            return newStyle;
        });
    };

    return (
        <div ref={toolbarRef} className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 rounded-[0px_0px_1px_1px] w-[240px] max-w-[20vw] shadow-md flex flex-col gap-4 z-[var(--zIndex)]">
            {/* Remove */}
            <button
                onClick={() => rmElementFunc(element.id)}
                className="px-3 py-2 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium border border-red-300 dark:bg-red-800 dark:border-red-600 dark:text-red-100"
            >Remove Element
            </button>

            <h3 className="tool-btn w-full flex items-center justify-between border-t pt-2 font-bold">Style</h3>

            {/* Bold/Italic/Underline */}
            <div className="flex gap-2">
                <button className={`tool-btn font-bold border p-1 min-w-[30px] rounded-md shadow-sm ${isBold && 'bg-stone-600 text-white'}`} onClick={() => onBold(element, Setter, activeScreen)}>B</button>
                <button className={`tool-btn italic border p-1 min-w-[30px] rounded-md shadow-sm ${isItalic && 'bg-stone-600 text-white'}`} onClick={() => onItalic(element, Setter, activeScreen)}>I</button>
                <button className={`tool-btn underline border p-1 min-w-[30px] rounded-md shadow-sm ${isUnderline && 'bg-stone-600 text-white'}`} onClick={() => onUnderline(element, Setter, activeScreen)}>U</button>
            </div>
            <input
                type="number"
                placeholder="Letter spacing"
                value={letterSpacing}
                onChange={e => {
                    const val = e.target.value
                    if (parseFloat(val) < 1 || parseFloat(val) > 8) return
                    setLetterSpacing(parseFloat(val))
                    activeRef.style.setProperty("letter-spacing", `${val}px`, "important")
                }}
                onBlur={(e) => {
                    setStyle((prev) => {
                        return { ...prev, letterSpacing: e.target.value }
                    })
                }}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm w-full" />


            {/* Font & Size */}
            <CustomSelect options={fontFamilyOptions} Default={style.fontFamily?.toString()} firstOption="fonts" disableFirstValue onChange={(val) => onFamilyFontChange(val, element, Setter, activeScreen)} />
            <CustomSelect options={fontSizeOptions} Default={style.fontSize?.toString()} firstOption="text size" disableFirstValue onChange={(val) => onSizeChange(val, element, Setter, activeScreen)} />

            {/* Color */}
            <h3 className="tool-btn w-full flex items-center justify-between border-t pt-2 font-bold">Colors</h3>
            <div className='flex gap-2 mb-2 pb-4'>
                <input type="color" value={textColor} onChange={e => { setTextColor(e.target.value); debouncedColorChange("color", e.target.value); activeRef.style.setProperty("color", e.target.value, "important") }} className="w-8 h-8 border border-gray-300 dark:border-gray-700 rounded cursor-pointer" title="Text color" />
                <input type="color" value={bgColor} onChange={e => { setBgColor(e.target.value); debouncedColorChange("bg", e.target.value); activeRef.style.setProperty("background-color", e.target.value, "important") }} className="w-8 h-8 border border-gray-300 dark:border-gray-700 rounded cursor-pointer" title="Text color" />
                <button
                    onClick={() => {
                        setBgColor("#000000"); // default fallback
                        if (activeRef.current) activeRef.current.style.removeProperty("background-color");
                        if (element && Setter) Setter((prev: any) => ({
                            ...prev,
                            style: { ...prev.style, [activeScreen]: { ...prev.style[activeScreen], backgroundColor: '' } }
                        }));
                    }}
                    className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm"
                    title="Clear background"
                >
                    Clear
                </button>

            </div>
            {/* Alignment */}
            <h3 className="tool-btn w-full flex items-center justify-between border-t pt-2 font-bold">Alignments</h3>
            <div className="flex gap-2">
                {['left', 'center', 'right', 'justify'].map((align) => {
                    const Icon = alignmentIcons[align];
                    return (
                        <button
                            key={align}
                            className={`tool-btn border p-1 rounded-md shadow-sm ${alignment === align ? 'bg-stone-600 text-white' : ''}`}
                            onClick={() => onAlignChange(align as any, element, Setter, activeScreen)}
                            title={`Align ${align}`}
                        >
                            <Icon />
                        </button>
                    );
                })}
            </div>


            {/* Position */}
            <h3 className="tool-btn w-full flex items-center justify-between border-t pt-2 font-bold">Position</h3>
            <CustomSelect options={positionOptions} firstOption="position" Default={style.position?.toString()} disableFirstValue onChange={val => setStyle(prev => ({ ...prev, position: val, zIndex: 1, width: val === 'relative' ? 'fit-content' : '' }))} />
            <input type="number" placeholder="z-index" value={style.zIndex?.toString() || ''} onChange={e => setStyle(prev => ({ ...prev, zIndex: parseInt(e.target.value) || 0 }))} className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm w-full" />

            {/* Top/Bottom/Left/Right */}
            <div className="grid grid-cols-2 gap-2">
                {['top', 'bottom', 'left', 'right'].map(key =>
                    <input key={key} type="text" placeholder={key} value={style[key as keyof React.CSSProperties]?.toString() || ''} onChange={e => handlePositionInput(key as any, e.target.value)} className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm" />
                )}
            </div>

            {/* Dimensions */}
            <h3 className="tool-btn w-full flex items-center justify-between border-t pt-2 font-bold">Dimensions</h3>
            <div className="grid grid-cols-2 gap-2 overflow-hidden">
                {['width', 'height', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom'].map(key => {
                    const isHeight = key === 'height';
                    return <input key={key} type="text" placeholder={key} value={style[key as keyof React.CSSProperties] || ''} onChange={e => handleInputChange(key as keyof React.CSSProperties, e.target.value, isHeight)} className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm w-full" />
                })}
            </div>
        </div>
    )
}

export default RichTextToolBar;
