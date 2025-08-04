import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({
  options = [], // require an object {label, value}
  Default = '',
  onChange,
  disableFirstValue,
  firstOption = 'Select an option',
  firstValue = '',
  styleClasses,
  baseClasses,
  addStyleClass,
  addBaseClass
}) => {
  const [selected, setSelected] = useState(Default || firstValue);
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
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

  const handleToggle = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 240; // 15rem (max-h-60)
      setDropUp(spaceBelow < dropdownHeight);
    }
    setOpen((prev) => !prev);
  };

  return (
    <div
      ref={dropdownRef}
      className={
        baseClasses
          ? baseClasses
          : `dark:bg-stone-100 relative rounded-3xl h-full flex-[1] ${addBaseClass}`
      }
    >
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          className={
            styleClasses ||
            `w-full text-left px-3 py-2 rounded-3xl border border-gray-300 shadow-sm bg-white flex items-center justify-between focus:outline-none ${addStyleClass}`
          }
        >
          <span
            className={
              selected === firstValue
                ? 'text-gray-500 dark:text-gray-500'
                : 'text-stone-700 text-sm'
            }
          >
            {getLabel(selected)}
          </span>
          <ChevronDown size={18} className="ml-2 text-gray-500" />
        </button>

        {open && (
          <ul
            className={`absolute ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'} w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-2xl shadow-lg z-10`}
          >
            {disableFirstValue ? (
              <li className="px-3 py-2 text-gray-400 cursor-not-allowed select-none">
                {firstOption}
              </li>
            ) : (
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
                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer dark:text-[black] ${
                  selected === opt.value ? 'bg-gray-100 font-medium' : ''
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
