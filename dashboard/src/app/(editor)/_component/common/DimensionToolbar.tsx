import React, { useCallback, useEffect, useState } from 'react';
import { useMyContext } from '@/Context/EditorContext';
import CustomSelect from '@/app/_common/CustomSelect';

export type StylesState = React.CSSProperties | Record<string, any>;
export type updateStylesType = (styles: Partial<StylesState>, applyAll?: Boolean | undefined) => void;

type DimensionToolbarProps = {
    updateStyles: updateStylesType
};

const DimensionToolbar: React.FC<DimensionToolbarProps> = ({ updateStyles }) => {
    const { currentSection, contextForSection } = useMyContext();
    const style = currentSection || {};
    const { sectionRef, rmSection, sectionGivenNameFn, sectionName } = contextForSection;
    const [name, setName] = useState<string>(sectionName)
    // Local state to hold temporary inputs
    const [localStyle, setLocalStyle] = useState<Partial<StylesState>>(style);

    const applyStyle = useCallback(
        (key: keyof StylesState, val: string | number) => {
            const newStyle = { ...localStyle, [key]: val };
            setLocalStyle(newStyle);
            updateStyles({ [key]: val }); // directly call updateStyles
        },
        [localStyle, updateStyles]
    );

    // Update effect: whenever currentSection changes, reset localStyle
    useEffect(() => {
        setLocalStyle(currentSection || {});
    }, [sectionRef]);

    const renderInput = (
        label: string,
        key: keyof StylesState,
        type: 'text' | 'number' = 'text',
        suffix?: string
    ) => {
        let value: string | number | undefined = localStyle?.[key];

        if (type === 'number' && typeof value === 'string') {
            value = parseFloat(value);
        }

        return (
            <div className="flex flex-col gap-1" key={key}>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
                <input
                    type={type}
                    value={value || ""}
                    onChange={(e) => {
                        const val = type === 'number'
                            ? `${e.target.value}${suffix || ''}`
                            : e.target.value;

                        // live apply to element
                        if (sectionRef?.current) {
                            (sectionRef.current as HTMLElement).style[key as any] = val;
                        }

                        // update local state immediately
                        setLocalStyle((prev) => ({ ...prev, [key]: val }));
                    }}
                    onBlur={(e) => {
                        const val = type === 'number'
                            ? `${e.target.value}${suffix || ''}`
                            : e.target.value;
                        applyStyle(key, val);
                    }}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                />
            </div>
        );
    };

    useEffect(() => {
        setName(sectionName)
    }, [sectionName])

    return (
        <div className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 w-[240px] max-w-[20vw] rounded-[4px_4px_0px_0px] border-b-2 border-b-stone-700 shadow-md flex flex-col gap-4 z-[var(--zIndex)]">
            <input
                type="text"
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                onChange={(e) => {
                    sectionGivenNameFn(e.target.value)
                    setName(e.target.value)
                }}
                value={name || ""}
            />
            {/* Remove Button */}
            <button
                className="px-3 py-2 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium border border-red-300 dark:bg-red-800 dark:border-red-600 dark:text-red-100"
                onClick={() => rmSection()}
                title="Remove Section"
            >
                Remove Section
            </button>

            <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    Dimension Controls
                </h3>
            </div>

            <div className="transition-all duration-300 grid grid-cols-1 gap-3 max-h-[1000px] opacity-100">
                {renderInput('Width', 'width')}
                {renderInput('Height', 'height')}

                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2">Padding (px)</h4>
                <div className="grid grid-cols-2 gap-x-2">
                    {(['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] as (keyof StylesState)[]).map((key) =>
                        renderInput(key.replace('padding', ''), key, 'number', 'px')
                    )}
                </div>

                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2">Margin (px)</h4>
                <div className="grid grid-cols-2 gap-x-2">
                    {(['marginTop', 'marginBottom', 'marginLeft', 'marginRight'] as (keyof StylesState)[]).map((key) =>
                        renderInput(key.replace('margin', ''), key, 'number', 'px')
                    )}
                </div>

                <div className="flex flex-col gap-1 my-1">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-200">Position</label>
                    <CustomSelect
                        options={[
                            { label: "Static", value: "static" },
                            { label: "Absolute", value: "absolute" },
                            { label: "Relative", value: "relative" },
                            { label: "Fixed", value: "fixed" }
                        ]}
                        firstOption="position"
                        disableFirstValue={true}
                        onChange={(value: string) => applyStyle('position', value)}
                        baseClasses="dark:bg-stone-100 relative rounded-2xl h-full flex-[1]"
                    />
                </div>

                {renderInput('Z-Index', 'zIndex', 'number')}
                {renderInput('Border Radius', 'borderRadius', 'text', 'px')}
            </div>
        </div>
    );
};

export default DimensionToolbar;
