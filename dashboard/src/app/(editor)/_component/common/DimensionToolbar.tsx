import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useMyContext } from '@/Context/EditorContext';

type StylesState = {
    width: string;
    height: string;
    paddingTop: number;
    paddingRight: number;
    paddingBottom: number;
    paddingLeft: number;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
    position: string;
    zIndexInput: number;
    borderRadius: number;
};

type DimensionToolbarProps = {
    updateStyles: (styles: Partial<StylesState>) => void;
};

const DimensionToolbar: React.FC<DimensionToolbarProps> = ({ updateStyles }) => {
    const [zIndex, setZIndex] = useState<number>(500);
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const { element } = useMyContext()
    console.log(element)
    const [stylesState, setStylesState] = useState<StylesState>(element || {
        width: '100vw',
        height: '20vh',
        paddingTop: 20,
        paddingRight: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        position: 'static',
        zIndexInput: 1,
        borderRadius: 0,
    });

    const applyStyle = (key: keyof StylesState, val: string | number) => {
        setStylesState((prev) => ({ ...prev, [key]: val }));
        updateStyles({ [key]: val } as Partial<StylesState>);
    };

    // const handleClick = () => setZIndex(getNextZIndex());

    const renderInput = (
        label: string,
        key: keyof StylesState,
        type: 'text' | 'number' = 'text',
        suffix = ''
    ) => (
        <div className="flex flex-col gap-1" key={key}>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-200">{label}</label>
            <input
                type={type}
                value={stylesState[key]}
                onChange={(e) => {
                    const val = type === 'number' ? Number(e.target.value) : e.target.value;
                    const suffixVal = suffix ? `${val}${suffix}` : val;
                    applyStyle(key, suffix ? suffixVal : val);
                }}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
            />
        </div>
    );

    return (
        <div
            // onClick={handleClick}
            className="bg-white dark:bg-zinc-900 text-sm text-stone-800 dark:text-stone-200 p-4 w-[240px] max-w-[20vw] rounded-md shadow-md flex flex-col gap-4 z-[var(--zIndex)]"
            style={{ zIndex }}
        >
            <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                    Dimension Controls
                </h3>
            </div>

            {/* 
            <button
                className="tool-btn w-full flex items-center justify-between border-t pt-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? 'Hide Dimensions' : 'Show Dimensions'}{' '}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button> 
            */}

            <div className={`transition-all duration-300 grid grid-cols-1 gap-3 overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {renderInput('Width', 'width')}
                {renderInput('Height', 'height')}

                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2">Padding (px)</h4>
                {(['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as (keyof StylesState)[]).map((key) =>
                    renderInput(key.replace('padding', ''), key, 'number', 'px')
                )}

                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-2">Margin (px)</h4>
                {(['marginTop', 'marginRight', 'marginBottom', 'marginLeft'] as (keyof StylesState)[]).map((key) =>
                    renderInput(key.replace('margin', ''), key, 'number', 'px')
                )}

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-200">Position</label>
                    <select
                        value={stylesState.position}
                        onChange={(e) => applyStyle('position', e.target.value)}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-sm"
                    >
                        <option value="static">static</option>
                        <option value="absolute">absolute</option>
                        <option value="relative">relative</option>
                        <option value="fixed">fixed</option>
                    </select>
                </div>

                {renderInput('Z-Index', 'zIndexInput', 'number')}
                {renderInput('Border Radius', 'borderRadius', 'number', 'px')}
            </div>
        </div>
    );

};

export default DimensionToolbar