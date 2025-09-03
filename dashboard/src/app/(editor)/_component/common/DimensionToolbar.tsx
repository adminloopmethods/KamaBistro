import React, { useCallback, useEffect, useState } from 'react';
import { useMyContext } from '@/Context/EditorContext';
import CustomSelect from '@/app/_common/CustomSelect';
import { convertVWVHtoPxParentClamped } from '@/utils/convertVWVHtoParent';

export type StylesState = React.CSSProperties | Record<string, any>;
export type updateStylesType = (styles: Partial<StylesState>, applyAll?: Boolean | undefined) => void;

type DimensionToolbarProps = {
    updateStyles: updateStylesType;
};

const DimensionToolbar: React.FC<DimensionToolbarProps> = ({ updateStyles }) => {
    const { currentSection, contextForSection, activeScreen } = useMyContext();
    const style = currentSection || {};
    const { sectionRef, rmSection, sectionGivenNameFn, sectionName } = contextForSection;

    const [name, setName] = useState<string>(sectionName);
    const [localStyle, setLocalStyle] = useState<Partial<StylesState>>(style);

    // Unit states
    const [paddingUnit, setPaddingUnit] = useState<'px' | '%' | 'em' | 'vw' | 'vh'>('px');
    const [marginUnit, setMarginUnit] = useState<'px' | '%' | 'em' | 'vw' | 'vh'>('px');
    const [widthUnit, setWidthUnit] = useState<'px' | '%' | 'em' | 'vw' | 'vh'>('px');
    const [heightUnit, setHeightUnit] = useState<'px' | '%' | 'em' | 'vw' | 'vh'>('px');
    const [radiusUnit, setRadiusUnit] = useState<'px' | '%' | 'em' | 'vw' | 'vh'>('px');

    const toKebabCase = (key: string) =>
        key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

    const applyStyle = useCallback(
        (key: keyof StylesState, val: string | number) => {
            let newVal: string | number = val;

            if (activeScreen !== 'xl' && sectionRef?.current) {
                const converted = convertVWVHtoPxParentClamped({ [key]: val }, sectionRef.current);
                newVal = converted[key]!;

                const cssKey = toKebabCase(key as string);
                (sectionRef.current as HTMLElement).style.setProperty(
                    cssKey,
                    String(newVal),
                    'important'
                );
            }

            const newStyle = { ...localStyle, [key]: val };
            setLocalStyle(newStyle);
            updateStyles({ [key]: val });
        },
        [localStyle, updateStyles, sectionRef, activeScreen]
    );

    // Reset local style on section change
    useEffect(() => {
        setLocalStyle(currentSection || {});
    }, [sectionRef, currentSection]);

    // --- Helper: apply unit change ---
    const handleUnitChange = (
        key: keyof StylesState,
        unit: string,
        setter: React.Dispatch<React.SetStateAction<any>>
    ) => {
        setter(unit);
        const currentValue = localStyle?.[key];

        if (currentValue !== undefined && currentValue !== '' && currentValue !== 'auto') {
            const num = parseFloat(currentValue as string);
            if (!isNaN(num)) {
                const newVal = `${num}${unit}`;
                applyStyle(key, newVal);
                setLocalStyle((prev) => ({ ...prev, [key]: newVal }));
            }
        }
    };

    const renderInput = (
        label: string,
        key: keyof StylesState,
        type: 'text' | 'number' = 'text',
        suffix?: string
    ) => {
        let value: string | number | undefined = localStyle?.[key];

        if (type === 'number' && typeof value === 'string') {
            if (value === 'auto' || value.trim() === '') {
                value = value;
            } else {
                const parsed = parseFloat(value);
                if (!isNaN(parsed)) {
                    value = parsed;
                }
            }
        }

        return (
            <div className="flex flex-col gap-1 w-full" key={key}>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                    {label}
                </label>
                <input
                    type="text"
                    value={value ?? ''}
                    placeholder={`e.g. 10${suffix || 'px'}, auto`}
                    onChange={(e) => {
                        let val = e.target.value;
                        if (val === '' || val === 'auto') {
                            applyStyle(key, val);
                            setLocalStyle((prev) => ({ ...prev, [key]: val }));
                            return;
                        }
                        if (!isNaN(Number(val))) {
                            val = `${val}${suffix || ''}`;
                        }
                        applyStyle(key, val);
                        setLocalStyle((prev) => ({ ...prev, [key]: val }));
                    }}
                    onBlur={(e) => {
                        let val = e.target.value;
                        if (val === '' || val === 'auto') {
                            applyStyle(key, val);
                            return;
                        }
                        if (!isNaN(Number(val))) {
                            val = `${val}${suffix || ''}`;
                        }
                        applyStyle(key, val);
                    }}
                    className="p-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                />
            </div>
        );
    };

    useEffect(() => {
        setName(sectionName);
    }, [sectionName]);

    const renderUnitSelect = (
        value: string,
        onChange: (val: string) => void
    ) => (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="ml-auto border rounded p-1 text-xs dark:bg-zinc-800"
        >
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="em">em</option>
            <option value="vw">vw</option>
            <option value="vh">vh</option>
        </select>
    );

    return (
        <div className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 w-[240px] max-w-[20vw] rounded-[4px_4px_0px_0px] border-b-2 border-b-stone-700 shadow-md flex flex-col gap-4 z-[var(--zIndex)]">
            {/* Section Name */}
            <input
                type="text"
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                onChange={(e) => {
                    sectionGivenNameFn(e.target.value);
                    setName(e.target.value);
                }}
                value={name || ''}
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

            <div className="transition-all duration-300 grid grid-cols-1 gap-3 max-h-[1000px] opacity-100 w-full">
                {/* Width */}
                <div className="flex items-center gap-2 w-full">
                    {renderInput('Width', 'width', 'number', widthUnit)}
                    {renderUnitSelect(widthUnit, (val) =>
                        handleUnitChange('width', val, setWidthUnit)
                    )}
                </div>

                {/* Height */}
                <div className="flex items-center gap-2">
                    {renderInput('Height', 'height', 'number', heightUnit)}
                    {renderUnitSelect(heightUnit, (val) =>
                        handleUnitChange('height', val, setHeightUnit)
                    )}
                </div>

                {/* Padding */}
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2 flex items-center gap-2">
                    Padding
                    {renderUnitSelect(paddingUnit, (val) =>
                        handleUnitChange('paddingTop', val, setPaddingUnit)
                    )}
                </h4>
                <div className="grid grid-cols-2 gap-x-2">
                    {(['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] as (keyof StylesState)[]).map(
                        (key) => renderInput(key.replace('padding', ''), key, 'number', paddingUnit)
                    )}
                </div>

                {/* Margin */}
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2 flex items-center gap-2">
                    Margin
                    {renderUnitSelect(marginUnit, (val) =>
                        handleUnitChange('marginTop', val, setMarginUnit)
                    )}
                </h4>
                <div className="grid grid-cols-2 gap-x-2">
                    {(['marginTop', 'marginBottom', 'marginLeft', 'marginRight'] as (keyof StylesState)[]).map(
                        (key) => renderInput(key.replace('margin', ''), key, 'number', marginUnit)
                    )}
                </div>

                {/* Position Selector */}
                <div className="flex flex-col gap-1 my-1">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-200">Position</label>
                    <CustomSelect
                        options={[
                            { label: 'Static', value: 'static' },
                            { label: 'Absolute', value: 'absolute' },
                            { label: 'Relative', value: 'relative' },
                            { label: 'Fixed', value: 'fixed' }
                        ]}
                        firstOption="position"
                        disableFirstValue={true}
                        onChange={(value: string) => applyStyle('position', value)}
                        baseClasses="dark:bg-stone-100 relative rounded-2xl h-full flex-[1]"
                    />
                </div>

                {renderInput('Z-Index', 'zIndex', 'number')}

                {/* Border Radius */}
                <div className="flex items-center gap-2">
                    {renderInput('Border Radius', 'borderRadius', 'number', radiusUnit)}
                    {renderUnitSelect(radiusUnit, (val) =>
                        handleUnitChange('borderRadius', val, setRadiusUnit)
                    )}
                </div>
            </div>
        </div>
    );
};

export default DimensionToolbar;
