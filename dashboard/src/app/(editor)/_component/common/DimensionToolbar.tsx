import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useMyContext } from '@/Context/EditorContext';

export type StylesState = React.CSSProperties | Record<string, any>

type DimensionToolbarProps = {
    updateStyles: (styles: Partial<StylesState>) => void;
};

const DimensionToolbar: React.FC<DimensionToolbarProps> = ({ updateStyles }) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const { currentSection } = useMyContext()
    const style = currentSection
    console.log(style)

    const applyStyle = (key: keyof StylesState, val: string | number) => {
        // setStylesState((prev) => ({ ...prev, [key]: val }));
        updateStyles({ [key]: val } as Partial<StylesState>);
    };

    // const handleClick = () => setZIndex(getNextZIndex());

    const renderInput = (
        label: string,
        key: keyof StylesState,
        type: 'text' | 'number' = 'text',
        suffix = ''
    ) => {
        let value: string | number | undefined = style?.[key];
        if (type === 'number' && typeof value === 'string') {
            value = parseFloat(value); // convert "20px" → 20
        }

        return (
            <div className="flex flex-col gap-1" key={key}>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
                <input
                    type={type}
                    value={value || ""}
                    onChange={(e) => {
                        const val = type === 'number' ? Number(e.target.value) : e.target.value;
                        applyStyle(key, val); // store just the number
                        console.log(val)
                    }}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                />
            </div>
        )
    };




    return (
        <div
            // onClick={handleClick}
            className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 w-[240px] max-w-[20vw] rounded-[4px_4px_0px_0px] border-b-2 border-b-stone-700 shadow-md flex flex-col gap-4 z-[var(--zIndex)]"
        >
            <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    Dimension Controls
                </h3>
            </div>

            <div className={`transition-all duration-300 grid grid-cols-1 gap-3 overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {renderInput('Width', 'width')}
                {renderInput('Height', 'height')}

                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2">Padding (px)</h4>
                <div className='grid grid-cols-2 gap-x-2'>
                    {(['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'] as (keyof StylesState)[]).map((key) =>
                        renderInput(key.replace('padding', ''), key, 'number', 'px')
                    )}
                </div>

                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2">Margin (px)</h4>
                <div className='grid grid-cols-2 gap-x-2'>
                    {(['marginTop', 'marginBottom', 'marginLeft', 'marginRight'] as (keyof StylesState)[]).map((key) =>
                        renderInput(key.replace('margin', ''), key, 'number', 'px')
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-200">Position</label>
                    <select
                        value={style?.position}
                        onChange={(e) => applyStyle('position', e.target.value)}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                    >
                        <option value="static">static</option>
                        <option value="absolute">absolute</option>
                        <option value="relative">relative</option>
                        <option value="fixed">fixed</option>
                    </select>
                </div>

                {renderInput('Z-Index', 'zIndex', 'number')}
                {renderInput('Border Radius', 'borderRadius', 'number', 'px')}
            </div>
        </div>
    );

};

export default DimensionToolbar