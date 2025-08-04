import React, { useState, useRef } from "react";
import styles from "./dimensionToolbar.module.css";
import { getNextZIndex } from "../../../../Functionality/globalZIndCounter";
// import { getNextZIndex } from "../../Functionality/globalZIndCounter";

const boxShadowPresets = {
    none: "none",
    sm: "1px 1px 3px rgba(0,0,0,0.1)",
    md: "2px 2px 6px rgba(0,0,0,0.15)",
    lg: "4px 4px 12px rgba(0,0,0,0.2)",
    xl: "6px 6px 20px rgba(0,0,0,0.25)",
    "dark-sm": "1px 1px 3px rgba(0,0,0,0.4)",
    "dark-md": "2px 2px 6px rgba(0,0,0,0.5)",
    "dark-lg": "4px 4px 12px rgba(0,0,0,0.6)",
    "dark-xl": "6px 6px 20px rgba(0,0,0,0.7)",
};

const ImageStyleToolbar = ({ element, style, onStyleChange, setElement, currentWidth }) => {
    const toolbarRef = useRef(null);
    const [zIndex, setZIndex] = useState(500);

    const handleClick = () => {
        setZIndex(getNextZIndex());
    };

    const renderInputRow = (label, value = "", type = "text", handleInput) => (
        <div className={styles.row}>
            <label className={styles.label}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => handleInput(e.target.value)}
                className={styles.input}
                min={type === "range" ? "0" : undefined}
                max={type === "range" ? (label.includes("Brightness") ? "2" : "1") : undefined}
                step={type === "range" ? "0.1" : undefined}
            />
        </div>
    );

    const handleInputStyles = (name) => {
        return (value) => {
            setElement((prev) => ({
                ...prev,
                style: {
                    ...prev.style,
                    [currentWidth]: {
                        ...prev.style?.[currentWidth],
                        [name]: value,
                    },
                },
            }));
        };
    };

    const handleInputValue = (name) => {
        return (value) => {
            setElement((prev) => ({
                ...prev,
                [name]: value,
            }));
        };
    };

    const handleFilterChange = (filterName) => {
        return (value) => {
            setElement((prev) => {
                const prevStyle = prev.style?.[currentWidth] || {};
                const prevFilter = prevStyle.filter || "";

                const filters = Object.fromEntries(
                    prevFilter
                        .split(" ")
                        .map((f) => f.trim().match(/^(\w+)\(([^)]+)\)$/))
                        .filter(Boolean)
                        .map(([, name, val]) => [name, val])
                );

                filters[filterName] = value;

                const newFilter = Object.entries(filters)
                    .map(([name, val]) => `${name}(${val})`)
                    .join(" ");

                return {
                    ...prev,
                    style: {
                        ...prev.style,
                        [currentWidth]: {
                            ...prevStyle,
                            filter: newFilter,
                        },
                    },
                };
            });
        };
    };

    const handlePositionChange = (e) => {
        const value = e.target.value;

        setElement((prev) => ({
            ...prev,
            style: {
                ...prev.style,
                [currentWidth]: {
                    ...prev.style?.[currentWidth],
                    position: value,
                },
            },
        }));
    };

    const handleShadowChange = (e) => {
        const value = e.target.value;

        setElement((prev) => ({
            ...prev,
            style: {
                ...prev.style,
                [currentWidth]: {
                    ...prev.style?.[currentWidth],
                    boxShadow: boxShadowPresets[value],
                },
            },
        }));
    };

    return (
        <div
            ref={toolbarRef}
            className={styles.toolbar}
            style={{ top: 100, left: 100, zIndex }} // Fixed position
            onClick={(e) => {
                e.stopPropagation();
                handleClick();
            }}
            onDoubleClick={(e) => e.stopPropagation()}
        >
            <div className={styles.dragHandle}>
                <h3 className={styles.heading}>Image Style Controls</h3>
            </div>

            {renderInputRow("Alternate text:", element.alt, "text", handleInputValue("alt"))}
            {renderInputRow("Width:", style.width || "300px", "text", handleInputStyles("width"))}
            {renderInputRow("Height:", style.height || "200px", "text", handleInputStyles("height"))}
            {renderInputRow("Margin:", style.margin || "0px", "text", handleInputStyles("margin"))}
            {renderInputRow("Radius:", style.borderRadius || "0px", "text", handleInputStyles("borderRadius"))}

            <div className={styles.row}>
                <label className={styles.label}>Box Shadow:</label>
                <select
                    className={styles.input}
                    value={
                        Object.entries(boxShadowPresets).find(
                            ([, val]) => val === style.boxShadow
                        )?.[0] || "none"
                    }
                    onChange={handleShadowChange}
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

            <h4 className={styles.sectionLabel}>Filters</h4>
            {renderInputRow(
                "Grayscale:",
                parseFloat(style.filter?.match(/grayscale\(([^)]+)\)/)?.[1] || "0"),
                "range",
                handleFilterChange("grayscale")
            )}
            {renderInputRow(
                "Brightness:",
                parseFloat(style.filter?.match(/brightness\(([^)]+)\)/)?.[1] || "1"),
                "range",
                handleFilterChange("brightness")
            )}

            <div className={styles.row}>
                <label className={styles.label}>Dragable:</label>
                <select
                    className={styles.input}
                    value={style.position || "static"}
                    onChange={handlePositionChange}
                >
                    <option value="static">No</option>
                    <option value="absolute">Yes</option>
                </select>
            </div>
        </div>
    );
};

export default ImageStyleToolbar;
