import { useEffect, useState } from 'react';
import { useMyContext } from '../../Context/ContextApi';
import {
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    ChevronDown, ChevronUp
} from 'lucide-react';
import {
    onBold, onItalic, onUnderline, onSizeChange,
    onFamilyFontChange, onColorChange, onAlignChange
} from './StyleObject';
import { getNextZIndex } from '../../Functionality/globalZIndCounter';

const RichTextToolBar = () => {
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
    const [isDimensionOpen, setIsDimensionOpen] = useState(false);
    const [textColor, setTextColor] = useState('#000000');
    const [zIndex, setZIndex] = useState(500);

    const [dimension, setDimension] = useState({
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

    const handleClick = () => setZIndex(getNextZIndex());

    const valueChangeOfInputs = (e, key, isHeight) => {
        const val = e.target.value.trim();
        if (isHeight && activeRef?.current?.parentElement) {
            const parent = activeRef.current.parentElement;
            const parentHeight = parent.getBoundingClientRect().height;
            const match = val.match(/^(\d+(?:\.\d+)?)(px|vh|%)$/);
            if (match) {
                const [_, numberStr, unit] = match;
                const num = parseFloat(numberStr);
                let pxValue = unit === 'px' ? num :
                    unit === 'vh' ? (window.innerHeight * num) / 100 :
                        unit === '%' ? (parentHeight * num) / 100 :
                            Infinity;

                if (pxValue > parentHeight) {
                    alert(`Height can't exceed parent's height of ${Math.floor(parentHeight)}px.`);
                    return;
                }
            }
        }
        setDimension(prev => ({ ...prev, [key]: val }));
    };

    useEffect(() => {
        const handlePointerDown = (e) => {
            if (
                toolbarRef.current &&
                !toolbarRef.current.contains(e.target) &&
                !activeRef.current.contains(e.target)
            ) {
                contextRef.clearReference();
                activeRef.current.style.outline = 'none';
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [contextRef, toolbarRef, activeRef]);

    useEffect(() => {
        if (Setter) {
            Setter((prev) => ({
                ...prev,
                style: { ...prev.style, [currentWidth]: dimension }
            }));
        }
    }, [dimension]);

    return (
        <div
            ref={toolbarRef}
            onClick={handleClick}
            style={{
                backgroundColor: '#f3f4f6',
                padding: '0.75rem',
                // borderRadius: '0.5rem',
                // boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontFamily: 'sans-serif',
                cursor: 'default',
                width: '240px',
                maxWidth: '20vw',
                // width:"100%",
                transition: '.1s width ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}
        >

            {/* Remove Button */}
            <button
                style={buttonStyle}
                onClick={() => rmElementFunc(element.id)}
                title="Remove Element"
            >
                Remove This Element
            </button>
            <div style={{ width: "100%", height: "1px", backgroundColor: "black", margin: "10px auto" }}></div>
            {/* Row: Bold, Italic, Underline */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={buttonStyle} onClick={() => onBold(element, Setter, currentWidth)}><b>B</b></button>
                <button style={buttonStyle} onClick={() => onItalic(element, Setter, currentWidth)}><i>I</i></button>
                <button style={buttonStyle} onClick={() => onUnderline(element, Setter, currentWidth)}><u>U</u></button>
            </div>

            {/* Font & Size Dropdowns */}
            <select defaultValue="" style={selectStyle} onChange={(e) => onFamilyFontChange(e.target.value, element, Setter, currentWidth)}>
                <option value="" disabled>Font</option>
                {fontFamilies.map(f => <option key={f} value={f}>{f}</option>)}
            </select>

            <select defaultValue="" style={selectStyle} onChange={(e) => onSizeChange(e.target.value, element, Setter, currentWidth)}>
                <option value="" disabled>Size</option>
                {fontSizes.map(size => <option key={size} value={size}>{size}</option>)}
            </select>

            {/* Color Picker */}
            <input
                type="color"
                value={textColor}
                onChange={(e) => onColorChange(e.target.value, element, Setter, currentWidth)}
                style={colorInputStyle}
                title="Text color"
            />

            {/* Row: Align Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={buttonStyle} onClick={() => onAlignChange("left", element, Setter, currentWidth)} title="Align Left"><AlignLeft /></button>
                <button style={buttonStyle} onClick={() => onAlignChange("center", element, Setter, currentWidth)} title="Align Center"><AlignCenter /></button>
                <button style={buttonStyle} onClick={() => onAlignChange("right", element, Setter, currentWidth)} title="Align Right"><AlignRight /></button>
                <button style={buttonStyle} onClick={() => onAlignChange("justify", element, Setter, currentWidth)} title="Justify"><AlignJustify /></button>
            </div>

            {/* Toggle Dimensions */}
            <button
                style={buttonStyle}
                onClick={() => setIsDimensionOpen(!isDimensionOpen)}
                title={isDimensionOpen ? 'Hide Dimensions' : 'Show Dimensions'}
            >
                Dimensions {isDimensionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>



            {/* Dimension Inputs */}
            <div
                style={{
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                    maxHeight: isDimensionOpen ? '500px' : '0',
                    opacity: isDimensionOpen ? 1 : 0,
                    marginTop: isDimensionOpen ? '0.5rem' : '0',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                }}
            >
                {['width', 'height', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom'].map(key => {
                    const isHeight = key === 'height';
                    return (
                        <input
                            key={key}
                            type="text"
                            placeholder={key}
                            value={dimension[key] || ''}
                            onChange={(e) => valueChangeOfInputs(e, key, isHeight)}
                            style={inputStyle}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const fontFamilies = ['Arial', 'Courier New', 'serif', 'system-ui', 'Helvetica',
    'Trebuchet MS', 'Tahoma', 'Monospace'
];
const fontSizes = ['10px', '11px', '12px', '14px', '16px', '18px', '24px', '32px', '36px', '40px', '48px', '54px', '64px'];

const buttonStyle = {
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px',
};

const selectStyle = {
    padding: '4px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    background: 'white',
    fontSize: '14px',
    cursor: 'pointer',
};

const inputStyle = {
    padding: '4px 6px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '13px',
    width: '100%',
};

const colorInputStyle = {
    width: '32px',
    height: '32px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer'
};

export default RichTextToolBar;
