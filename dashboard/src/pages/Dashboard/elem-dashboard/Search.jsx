import { Search, X } from 'lucide-react';
import { useState } from 'react';

const SearchC = ({ onChange, placeholder, styleClasses }) => {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
        if (onChange) onChange(e.target.value);
    };

    const clearInput = () => {
        setValue('');
        if (onChange) onChange('');
    };

    return (
        <div className="relative flex-[4]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

            <input
                type="search"
                value={value}
                onChange={handleChange}
                placeholder={placeholder || "Search..."}
                className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${styleClasses}`}
            />

            {value && (
                <button
                    onClick={clearInput}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default SearchC;
