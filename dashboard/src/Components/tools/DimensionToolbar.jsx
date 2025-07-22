import React, { useState } from 'react';
import { getNextZIndex } from '../../Functionality/globalZIndCounter';

const DimensionToolbar = ({ updateStyles }) => {
    const [widthInput, setWidthInput] = useState('100vw');
    const [heightInput, setHeightInput] = useState('20vh');

    const [paddingTopInput, setPaddingTopInput] = useState(20);
    const [paddingRightInput, setPaddingRightInput] = useState(20);
    const [paddingBottomInput, setPaddingBottomInput] = useState(20);
    const [paddingLeftInput, setPaddingLeftInput] = useState(20);

    const [marginTopInput, setMarginTopInput] = useState(0);
    const [marginRightInput, setMarginRightInput] = useState(0);
    const [marginBottomInput, setMarginBottomInput] = useState(0);
    const [marginLeftInput, setMarginLeftInput] = useState(0);

    const [positionInput, setPositionInput] = useState('static');
    const [zIndexInput, setZIndexInput] = useState(1);
    const [borderRadiusInput, setBorderRadiusInput] = useState(0);

    const [zIndex, setZIndex] = useState(500);

    const applySingleStyle = (propertyName, value) => {
        console.log("qwer")
        updateStyles({ [propertyName]: value });
    };

    const handleToolbarClick = () => setZIndex(getNextZIndex());

    const renderInputRow = (label, value, onChange, type = 'text') => (
        <div style={styles.row}>
            <label style={styles.label}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                style={styles.input}
            />
        </div>
    );

    return (
        <div
            style={{ ...styles.toolbar, zIndex }}
            onClick={handleToolbarClick}
        >
            <div style={styles.dragHandle}>
                <h3 style={styles.heading}>Dimension Controls</h3>
            </div>

            {renderInputRow('Width:', widthInput, (e) => {
                setWidthInput(e.target.value);
                applySingleStyle('width', e.target.value);
            })}

            {renderInputRow('Height:', heightInput, (e) => {
                setHeightInput(e.target.value);
                applySingleStyle('height', e.target.value);
            })}

            <h4 style={styles.sectionLabel}>Padding (px):</h4>
            <div style={styles.grid}>
                {renderInputRow('Top:', paddingTopInput, (e) => {
                    const v = Number(e.target.value);
                    setPaddingTopInput(v);
                    applySingleStyle('paddingTop', `${v}px`);
                }, 'number')}
                {renderInputRow('Right:', paddingRightInput, (e) => {
                    const v = Number(e.target.value);
                    setPaddingRightInput(v);
                    applySingleStyle('paddingRight', `${v}px`);
                }, 'number')}
                {renderInputRow('Bottom:', paddingBottomInput, (e) => {
                    const v = Number(e.target.value);
                    setPaddingBottomInput(v);
                    applySingleStyle('paddingBottom', `${v}px`);
                }, 'number')}
                {renderInputRow('Left:', paddingLeftInput, (e) => {
                    const v = Number(e.target.value);
                    setPaddingLeftInput(v);
                    applySingleStyle('paddingLeft', `${v}px`);
                }, 'number')}
            </div>

            <h4 style={styles.sectionLabel}>Margin (px):</h4>
            <div style={styles.grid}>
                {renderInputRow('Top:', marginTopInput, (e) => {
                    const v = Number(e.target.value);
                    setMarginTopInput(v);
                    applySingleStyle('marginTop', `${v}px`);
                }, 'number')}
                {renderInputRow('Right:', marginRightInput, (e) => {
                    const v = Number(e.target.value);
                    setMarginRightInput(v);
                    applySingleStyle('marginRight', `${v}px`);
                }, 'number')}
                {renderInputRow('Bottom:', marginBottomInput, (e) => {
                    const v = Number(e.target.value);
                    setMarginBottomInput(v);
                    applySingleStyle('marginBottom', `${v}px`);
                }, 'number')}
                {renderInputRow('Left:', marginLeftInput, (e) => {
                    const v = Number(e.target.value);
                    setMarginLeftInput(v);
                    applySingleStyle('marginLeft', `${v}px`);
                }, 'number')}
            </div>

            <h4 style={styles.sectionLabel}>Other Styles:</h4>
            <div style={styles.grid}>
                <div style={styles.row}>
                    <label style={styles.label}>Position:</label>
                    <select
                        value={positionInput}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPositionInput(value);
                            applySingleStyle('position', value);
                        }}
                        style={styles.input}
                    >
                        <option value="static">static</option>
                        <option value="absolute">absolute</option>
                    </select>
                </div>

                {renderInputRow('Z-Index:', zIndexInput, (e) => {
                    const v = Number(e.target.value);
                    setZIndexInput(v);
                    applySingleStyle('zIndex', v);
                }, 'number')}

                {renderInputRow('Border Radius:', borderRadiusInput, (e) => {
                    const v = Number(e.target.value);
                    setBorderRadiusInput(v);
                    applySingleStyle('borderRadius', `${v}px`);
                }, 'number')}
            </div>
        </div>
    );
};

const styles = {
    toolbar: {
        backgroundColor: '#f3f4f6',
        padding: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '100vw',
        width: '240px',  // 👈 Shrunk toolbar width
        overflowX: 'hidden',
        userSelect: 'none',
    },
    dragHandle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #d1d5db',
        marginBottom: '0.5rem',
    },
    heading: {
        fontSize: '1.125rem',
        fontWeight: 600,
        color: '#1f2937',
    },
    sectionLabel: {
        fontSize: '1rem',
        fontWeight: 500,
        color: '#1f2937',
        marginTop: '1rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr', // 👈 one column to fit narrow width
        gap: '0.75rem',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        gap: '8px',
        flexWrap: 'wrap',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#374151',
        flex: '0 0 auto',
    },
    input: {
        padding: '4px 6px',
        fontSize: '13px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        transition: 'box-shadow 0.2s ease-in-out',
        userSelect: 'none',
        width: '100%',        // 👈 takes full row width
        flex: 1,              // 👈 allow it to shrink/grow with layout
        minWidth: 0,
    },
};


export default DimensionToolbar;