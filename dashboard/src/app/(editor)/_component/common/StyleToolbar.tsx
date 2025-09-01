import React, { useState, useRef, useCallback } from 'react';
import dimensionStyle from "./dimensionToolbar.module.css";
import ImageSelector from './ImageSelector';
import { cloudinaryApiPoint } from '@/utils/endpoints';
import CustomSelect from '@/app/_common/CustomSelect';
import { screenType, useMyContext } from '@/Context/EditorContext';
import { debounce } from "lodash";
import CopyStylesUI from './CopyStyleUI';

const shadowPresets: Record<string, string> = {
    none: 'none',
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.2)',
    lg: '0 10px 15px rgba(0,0,0,0.3)',
    xl: '0 20px 25px rgba(0,0,0,0.4)',
    "dark-sm": "0 1px 3px rgba(0,0,0,0.5)",
    "dark-md": "0 4px 6px rgba(0,0,0,0.6)",
    "dark-lg": "0 10px 15px rgba(0,0,0,0.7)",
    "dark-xl": "0 20px 25px rgba(0,0,0,0.85)",
};

type StyleToolbarProps = {
    updateStyles: (styles: Record<string, any>, applyAll?: boolean) => void;
    rmSection?: (id: string) => void;
};

const StyleToolbar: React.FC<StyleToolbarProps> = ({ updateStyles, rmSection }) => {
    const { contextForSection, screenStyleObj } = useMyContext()
    const { sectionRef, currentSection } = contextForSection

    const [color1, setColor1] = useState<string>('rgba(255,0,0,1)');
    const [color2, setColor2] = useState<string>('rgba(0,0,255,1)');
    const [gradientDirection, setGradientDirection] = useState<string>('to right');
    const [gradient, setGradient] = useState<string>('');
    const [bgImage, setBgImage] = useState<string>('');
    const [boxShadow, setBoxShadow] = useState<string>(currentSection?.boxShadow || 'none');
    const [showImageSelector, setShowImageSelector] = useState<boolean>(false);

    const toolbarRef = useRef<HTMLDivElement>(null);

    // ===== Debounced Handlers =====
    const debouncedUpdateStyles = useCallback(
        debounce((styles: Record<string, any>) => {
            updateStyles(styles);
        }, 150),
        [updateStyles]
    );

    const updateBackground = (url?: string) => {
        let combined = '';
        if (gradient && (bgImage || url)) {
            combined = `${gradient}, url(${url || bgImage})`;
        } else if (gradient) {
            combined = gradient;
        } else if (bgImage || url) {
            combined = `url(${url || bgImage})`;
        } else if (!url) {
            combined = `${gradient}`;
        }
        debouncedUpdateStyles({ backgroundImage: combined });
    };

    const handleShadowChange = (value: string) => {
        setBoxShadow(shadowPresets[value]);
        debouncedUpdateStyles({ boxShadow: shadowPresets[value] });
    };

    const handleGradientUpdate = (newColor1?: string, newColor2?: string, newDir?: string) => {
        const g = `linear-gradient(${newDir || gradientDirection}, ${newColor1 || color1}, ${newColor2 || color2})`;
        setGradient(g);
        updateBackground();
    };

    const renderInputRow = (label: string, input: React.ReactNode, extra: React.ReactNode = null) => (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
            <div className="flex flex-col gap-2">
                {input}
                {extra}
            </div>
        </div>
    );

    const copyTheStyle = (screenSize: screenType) => {

        if (screenStyleObj.screenStyles?.[screenSize]) {

            updateStyles(screenStyleObj.screenStyles?.[screenSize])
        }
    }

    return (
        <div
            ref={toolbarRef}

            className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 w-[240px] max-w-[20vw] rounded-[0px_0px_4px_4px] shadow-md flex flex-col gap-4"
        >
            <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    Style Controls
                </h3>
            </div>

            {/* Background Image */}
            <button
                className='text-xs font-medium text-gray-700 dark:text-gray-200 border p-3 rounded-md cursor-pointer'
                onClick={() => setShowImageSelector(true)}
            >
                Set Background Image
            </button>

            <button
                onClick={() => { setBgImage(''); updateBackground(); }}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded-md"
                disabled={Boolean(!currentSection?.backgroundImage)}
            >
                Remove Background Image
            </button>

            {/* Background Repeat */}
            <CustomSelect
                options={[
                    { label: "No Repeat", value: "no-repeat" },
                    { label: "Repeat", value: "repeat" },
                    { label: "Repeat X", value: "repeat-x" },
                    { label: "Repeat Y", value: "repeat-y" },
                ]}
                Default={currentSection?.backgroundRepeat || undefined}
                firstOption='Background Repeat'
                disableFirstValue={true}
                onChange={(val) => { debouncedUpdateStyles({ backgroundRepeat: val }); }}
            />

            {/* Background Attachment */}
            <CustomSelect
                options={[
                    { label: "Scroll", value: "scroll" },
                    { label: "Fixed", value: "fixed" },
                    { label: "Local", value: "local" },
                ]}
                Default={currentSection?.backgroundAttachment}
                firstOption='BG - Attachment'
                disableFirstValue={true}
                onChange={(val) => { debouncedUpdateStyles({ backgroundAttachment: val }); }}
            />

            {/* Background Size */}
            <CustomSelect
                options={[
                    { label: "Auto", value: "auto" },
                    { label: "Cover", value: "cover" },
                    { label: "Contain", value: "contain" },
                ]}
                firstOption='Background Size'
                disableFirstValue={true}
                onChange={(val) => { debouncedUpdateStyles({ backgroundSize: val }); }}
            />

            {/* Background Position */}
            <CustomSelect
                options={[
                    { label: "Center", value: "center" },
                    { label: "Top Left", value: "top left" },
                    { label: "Top Right", value: "top right" },
                    { label: "Bottom Left", value: "bottom left" },
                    { label: "Bottom Right", value: "bottom right" },
                ]}
                Default={currentSection?.position}
                firstOption='Background Position'
                disableFirstValue={true}
                onChange={(val) => { debouncedUpdateStyles({ backgroundPosition: val }); }}
            />

            {/* Gradient Colors */}
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">Gradient Colors:</label>
            <div className="flex flex-col gap-3">
                {[{ color: color1, setColor: setColor1, label: 'Color 1' }, { color: color2, setColor: setColor2, label: 'Color 2' }].map(({ color, setColor, label }, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                        <span className="text-xs font-semibold">{label}</span>
                        <input
                            type="color"
                            value={'#' + rgbaToHex(color)}
                            onChange={(e) => {
                                const newColor = hexToRgba(e.target.value, 1);
                                setColor(newColor);
                                if (label === 'Color 1') handleGradientUpdate(newColor, undefined, undefined);
                                else handleGradientUpdate(undefined, newColor, undefined);
                            }}
                            className={dimensionStyle.colorInput}
                        />
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => {
                                const newColor = e.target.value;
                                setColor(newColor);
                                if (label === 'Color 1') handleGradientUpdate(newColor, undefined, undefined);
                                else handleGradientUpdate(undefined, newColor, undefined);
                            }}
                            placeholder="rgba(...)"
                            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                        />
                    </div>
                ))}
            </div>

            {renderInputRow(
                'Gradient Direction',
                <CustomSelect
                    options={[
                        { label: "Top", value: "to top" },
                        { label: "Right", value: "to right" },
                        { label: "Bottom", value: "to bottom" },
                        { label: "Left", value: "to left" },
                        { label: "Top Right", value: "to top right" },
                        { label: "Bottom Left", value: "to bottom left" },
                    ]}
                    firstOption='Gradient Direction'
                    disableFirstValue={true}
                    onChange={(val) => {
                        setGradientDirection(val);
                        handleGradientUpdate(undefined, undefined, val);
                    }}
                />,
                <button
                    onClick={() => { setGradient(''); updateBackground(); }}
                    className="px-2 py-1 bg-red-500 text-white text-xs rounded-md"
                >
                    Clear
                </button>
            )}

            {/* Flexbox Controls */}
            <div className="flex flex-col gap-3 border-t pt-3 border-b pb-2">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-200">Layout (Flexbox)</label>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={currentSection?.display === "flex"}
                        onChange={(e) => { debouncedUpdateStyles({ display: e.target.checked ? 'flex' : 'block' }); }}
                    />
                    <span className="text-sm">Enable Layout</span>
                </div>

                {currentSection?.display === "flex" && (
                    <>
                        {renderInputRow(
                            'Layout Direction',
                            <CustomSelect
                                options={[
                                    { label: "Row", value: "row" },
                                    { label: "Row Reverse", value: "row-reverse" },
                                    { label: "Column", value: "column" },
                                    { label: "Column Reverse", value: "column-reverse" },
                                ]}
                                Default={currentSection?.flexDirection}
                                onChange={(val) => { debouncedUpdateStyles({ flexDirection: val }); }}
                            />
                        )}

                        {renderInputRow(
                            'Gap (px)',
                            <input
                                type="number"
                                min="0"
                                onChange={(e) => {
                                    if (sectionRef?.current) {
                                        sectionRef.current.style.setProperty("gap", `${e.target.value}px`, "important");
                                    }
                                    debouncedUpdateStyles({ gap: `${e.target.value}px` });
                                }}
                                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                            />
                        )}

                        {renderInputRow(
                            'Flex Wrap',
                            <CustomSelect
                                options={[
                                    { label: "No Wrap", value: "nowrap" },
                                    { label: "Wrap", value: "wrap" },
                                    { label: "Wrap Reverse", value: "wrap-reverse" },
                                ]}
                                Default={currentSection?.flexWrap}
                                onChange={(val) => { debouncedUpdateStyles({ flexWrap: val }); }}
                            />
                        )}


                        {renderInputRow(
                            'Justify Content',
                            <CustomSelect
                                options={[
                                    { label: "Start", value: "flex-start" },
                                    { label: "Center", value: "center" },
                                    { label: "End", value: "flex-end" },
                                    { label: "Space Between", value: "space-between" },
                                    { label: "Space Around", value: "space-around" },
                                    { label: "Space Evenly", value: "space-evenly" },
                                ]}
                                Default={currentSection?.justifyContent}
                                onChange={(val) => { debouncedUpdateStyles({ justifyContent: val }); }}
                            />
                        )}

                        {renderInputRow(
                            'Align Items',
                            <CustomSelect
                                options={[
                                    { label: "Stretch", value: "stretch" },
                                    { label: "Start", value: "flex-start" },
                                    { label: "Center", value: "center" },
                                    { label: "End", value: "flex-end" },
                                    { label: "Baseline", value: "baseline" },
                                ]}
                                Default={currentSection?.alignItems}
                                onChange={(val) => { debouncedUpdateStyles({ alignItems: val }); }}
                            />
                        )}

                        {renderInputRow(
                            'Wrap Items',
                            <CustomSelect
                                options={[
                                    { label: "Stretch", value: "stretch" },
                                    { label: "Start", value: "flex-start" },
                                    { label: "Center", value: "center" },
                                    { label: "End", value: "flex-end" },
                                    { label: "Baseline", value: "baseline" },
                                ]}
                                Default={currentSection?.alignItems}
                                onChange={(val) => { debouncedUpdateStyles({ alignItems: val }); }}
                            />
                        )}
                    </>
                )}
            </div>

            {renderInputRow(
                'Text Color',
                <CustomSelect
                    options={[
                        { label: "Black", value: "#000000" },
                        { label: "White", value: "#FFFFFF" },
                        { label: "Red", value: "#FF0000" },
                        { label: "Green", value: "#00FF00" },
                        { label: "Blue", value: "#0000FF" },
                        { label: "Yellow", value: "#FFFF00" },
                        { label: "Orange", value: "#FFA500" },
                        { label: "Purple", value: "#800080" },
                        { label: "Pink", value: "#FFC0CB" },
                        { label: "Gray", value: "#808080" },
                        { label: "Dodger Blue", value: "#1E90FF" },
                        { label: "Lime Green", value: "#32CD32" },
                        { label: "Deep Pink", value: "#FF1493" },
                        { label: "Gold", value: "#FFD700" },
                        { label: "Dark Red", value: "#8B0000" },
                        { label: "Dark Green", value: "#006400" },
                        { label: "Indigo", value: "#4B0082" },
                        { label: "Dark Turquoise", value: "#00CED1" },
                        { label: "Orange Red", value: "#FF4500" },
                    ]}
                    Default={currentSection?.color}
                    onChange={(val) => { debouncedUpdateStyles({ color: val }); }}
                />
            )}

            {renderInputRow(
                'Box Shadow',
                <CustomSelect
                    options={Object.entries(shadowPresets).map(([key]) => ({ label: key, value: key }))}
                    Default={Object.entries(shadowPresets).find(([k, v]) => v === boxShadow)?.[0] || "none"}
                    onChange={handleShadowChange}
                />
            )}

            
            <CopyStylesUI copyTheStyle={copyTheStyle} />


            {showImageSelector &&
                <ImageSelector
                    onSelectImage={(fileInfo: any) => {
                        setBgImage(cloudinaryApiPoint + fileInfo[0]);
                        updateBackground(cloudinaryApiPoint + fileInfo[0]);
                        setShowImageSelector(false);
                    }}
                    onClose={() => setShowImageSelector(false)}
                    type="IMAGE"
                />
            }

        </div>
    );
};

export default StyleToolbar;

// === Helper Functions ===
export function rgbaToHex(rgba: string): string {
    const match = rgba.match(/\d+(\.\d+)?/g);
    if (!match) return 'ffffff';
    const [r, g, b] = match.map((v, i) => i < 3 ? Number(v).toString(16).padStart(2, '0') : null);
    return `${r}${g}${b}`;
}

export function hexToRgba(hex: string, alpha = 1): string {
    const parsed = hex.replace('#', '');
    const bigint = parseInt(parsed, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}
