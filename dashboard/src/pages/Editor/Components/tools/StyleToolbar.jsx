import React, { useState, useRef } from 'react';
import { getNextZIndex } from '../../../../Functionality/globalZIndCounter';
import dimensionStyle from "./dimensionToolbar.module.css";

const shadowPresets = {
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

const StyleToolbar = ({ updateStyles, rmSection }) => {
    const [color1, setColor1] = useState('rgba(255,0,0,1)');
    const [color2, setColor2] = useState('rgba(0,0,255,1)');
    const [gradientDirection, setGradientDirection] = useState('to right');
    const [bgImageUrl, setBgImageUrl] = useState('');

    const [repeat, setRepeat] = useState('no-repeat');
    const [attachment, setAttachment] = useState('scroll');
    const [size, setSize] = useState('cover');
    const [position, setPosition] = useState('center');
    const [objectFit, setObjectFit] = useState('cover');
    const [fontFamily, setFontFamily] = useState('Arial');
    const [boxShadow, setBoxShadow] = useState('none');

    const [toolbarTop, setToolbarTop] = useState(250);
    const [toolbarLeft, setToolbarLeft] = useState(500);
    const toolbarRef = useRef(null);
    const [zIndex, setZIndex] = useState(500);

    const handleClick = () => setZIndex(getNextZIndex());

    const applyGradient = () => {
        const gradient = `linear-gradient(${gradientDirection}, ${color1}, ${color2})`;
        updateStyles({ backgroundImage: gradient });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setBgImageUrl(url);
            updateStyles({ backgroundImage: `url(${url})` });
        }
    };

    const handleShadowChange = (e) => {
        const value = e.target.value;
        setBoxShadow(shadowPresets[value]);
        updateStyles({ boxShadow: shadowPresets[value] });
    };

    const renderInputRow = (label, input, extra = null) => (
        <div style={styles.row}>
            <label style={styles.label}>{label}</label>
            <div style={styles.inputGroup}>
                {input}
                {extra}
            </div>
        </div>
    );

    return (
        <div
            ref={toolbarRef}
            style={{ ...styles.toolbar, top: toolbarTop, left: toolbarLeft, zIndex }}
            onClick={handleClick}
        >
            <div style={styles.dragHandle}>
                <h3 style={styles.heading}>Advanced Style Controls</h3>
            </div>

            {/* Gradient Controls */}
            <div style={styles.row}>
                <label style={styles.label}>Gradient Colors:</label>
                <div style={styles.colorPair}>
                    <div style={styles.colorItem}>
                        <span style={styles.colorLabel}>Color 1</span>
                        <input
                            type="color"
                            value={'#' + rgbaToHex(color1)}
                            onChange={(e) => setColor1(hexToRgba(e.target.value, 1))}
                            className={dimensionStyle.colorInput}
                        />
                        <input
                            type="text"
                            value={color1}
                            onChange={(e) => setColor1(e.target.value)}
                            placeholder="rgba(255,0,0,0.5)"
                            style={{ ...styles.input, width: '120px' }}
                        />
                    </div>
                    <div style={styles.colorItem}>
                        <span style={styles.colorLabel}>Color 2</span>
                        <input
                            type="color"
                            value={'#' + rgbaToHex(color2)}
                            onChange={(e) => setColor2(hexToRgba(e.target.value, 1))}
                            className={dimensionStyle.colorInput}
                        />
                        <input
                            type="text"
                            value={color2}
                            onChange={(e) => setColor2(e.target.value)}
                            placeholder="rgba(0,0,255,0.5)"
                            style={{ ...styles.input, width: '120px' }}
                        />
                    </div>
                </div>
            </div>

            {renderInputRow(
                'Gradient Direction:',
                <select
                    value={gradientDirection}
                    onChange={(e) => setGradientDirection(e.target.value)}
                    style={styles.input}
                >
                    <option value="to top">Top</option>
                    <option value="to right">Right</option>
                    <option value="to bottom">Bottom</option>
                    <option value="to left">Left</option>
                    <option value="to top right">Top Right</option>
                    <option value="to bottom left">Bottom Left</option>
                </select>,
                <>
                    <button style={styles.button} onClick={applyGradient}>Apply</button>
                    <button style={styles.button} onClick={() => updateStyles({ backgroundImage: '' })}>Clear</button>
                </>
            )}

            {renderInputRow(
                'Background Image:',
                <input type="file" accept="image/*" onChange={handleImageUpload} />,
                <button style={styles.button} onClick={() => updateStyles({ backgroundImage: '' })}>Clear</button>
            )}

            {renderInputRow(
                'Repeat:',
                <select value={repeat} onChange={(e) => {
                    setRepeat(e.target.value);
                    updateStyles({ backgroundRepeat: e.target.value });
                }} style={styles.input}>
                    <option value="no-repeat">No Repeat</option>
                    <option value="repeat">Repeat</option>
                    <option value="repeat-x">Repeat X</option>
                    <option value="repeat-y">Repeat Y</option>
                </select>
            )}

            {renderInputRow(
                'Attachment:',
                <select value={attachment} onChange={(e) => {
                    setAttachment(e.target.value);
                    updateStyles({ backgroundAttachment: e.target.value });
                }} style={styles.input}>
                    <option value="scroll">Scroll</option>
                    <option value="fixed">Fixed</option>
                    <option value="local">Local</option>
                </select>
            )}

            {renderInputRow(
                'Size:',
                <select value={size} onChange={(e) => {
                    setSize(e.target.value);
                    updateStyles({ backgroundSize: e.target.value });
                }} style={styles.input}>
                    <option value="auto">Auto</option>
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                </select>
            )}

            {renderInputRow(
                'Position:',
                <select value={position} onChange={(e) => {
                    setPosition(e.target.value);
                    updateStyles({ backgroundPosition: e.target.value });
                }} style={styles.input}>
                    <option value="center">Center</option>
                    <option value="top left">Top Left</option>
                    <option value="top right">Top Right</option>
                    <option value="bottom left">Bottom Left</option>
                    <option value="bottom right">Bottom Right</option>
                </select>
            )}

            {renderInputRow(
                'Object Fit:',
                <select value={objectFit} onChange={(e) => {
                    setObjectFit(e.target.value);
                    updateStyles({ objectFit: e.target.value });
                }} style={styles.input}>
                    <option value="fill">Fill</option>
                    <option value="contain">Contain</option>
                    <option value="cover">Cover</option>
                    <option value="none">None</option>
                    <option value="scale-down">Scale Down</option>
                </select>
            )}

            {renderInputRow(
                'Font Family:',
                <select
                    value={fontFamily}
                    onChange={(e) => {
                        setFontFamily(e.target.value);
                        updateStyles({ fontFamily: e.target.value });
                    }}
                    style={styles.input}
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

            {/* ✅ Final Updated Shadow Section */}
            <div style={styles.row}>
                <label style={styles.label}>Box Shadow:</label>
                <select
                    style={styles.input}
                    onChange={handleShadowChange}
                    value={Object.entries(shadowPresets).find(([key, val]) => val === boxShadow)?.[0] || "none"}
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
            </div>
        </div>
    );
};

export default StyleToolbar;

// === Helper Functions ===

function rgbaToHex(rgba) {
    const match = rgba.match(/\d+(\.\d+)?/g);
    if (!match) return 'ffffff';
    const [r, g, b] = match.map((v, i) => i < 3 ? Number(v).toString(16).padStart(2, '0') : null);
    return `${r}${g}${b}`;
}

function hexToRgba(hex, alpha = 1) {
    const parsed = hex.replace('#', '');
    const bigint = parseInt(parsed, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}

// === Styles Object ===

const styles = {
    toolbar: {
        borderTop: "1px solid black",
        backgroundColor: '#f3f4f6',
        padding: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '100vw',
        overflowY: 'auto',
        overflowX: 'hidden',
        userSelect: 'none',
        width: '240px',
    },
    dragHandle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #d1d5db',
        marginBottom: '0.5rem',
        cursor: 'default',
        touchAction: 'none',
    },
    heading: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#1f2937',
    },
    row: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '10px',
        gap: '4px',
        width: '100%',
    },
    label: {
        fontWeight: 500,
        color: '#374151',
        fontSize: '0.9rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '6px',
        width: '100%',
    },
    input: {
        padding: '4px 6px',
        fontSize: '13px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        transition: 'box-shadow 0.2s ease-in-out',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
    },
    button: {
        padding: '6px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        width: '100%',
        boxSizing: 'border-box',
    },
    colorPair: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
    },
    colorItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '4px',
        width: '100%',
    },
    colorLabel: {
        fontSize: '12px',
        fontWeight: 500,
    },
};
