import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({
  options = [],
  Default = '',
  onChange,
  disableFirstValue,
  firstOption = 'Select an option',
  firstValue = '',
  styleClasses
}) => {
  const [selected, setSelected] = useState(Default || firstValue);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelected(Default || firstValue);
  }, [Default, firstValue]);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
    if (onChange) onChange(value);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLabel = (val) => {
    if (val === firstValue) return firstOption;
    return options.find((opt) => opt.value === val)?.label || firstOption;
  };

  return (
    <div ref={dropdownRef} className={`relative rounded-3xl flex-[1]`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left px-3 py-2 rounded-3xl border border-gray-300 rounded-md shadow-sm bg-white flex items-center justify-between focus:outline-none ${styleClasses}`}
      >
        <span className={selected === firstValue ? 'text-gray-400' : ''}>
          {getLabel(selected)}
        </span>
        <ChevronDown size={18} className="ml-2 text-gray-500" />
      </button>

      {open && (
        <ul className="absolute mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-2xl shadow-lg z-10">
          {disableFirstValue && (
            <li
              className="px-3 py-2 text-gray-400 cursor-not-allowed select-none"
            >
              {firstOption}
            </li>
          )}
          {!disableFirstValue && (
            <li
              onClick={() => handleSelect(firstValue)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {firstOption}
            </li>
          )}
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                selected === opt.value ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
