"use client";

import React, { useState, ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

// Props type definition
type InputFieldProps = {
  type?: string;
  name: string;
  value: string;
  placeholder?: string;
  label?: string;
  labelStyle?: string;
  className?: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  required = true,
  label,
  labelStyle = "",
  className
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="pl-0 inline-block mb-1">
          <span className={`label-text text-stone-800 dark:text-stone-200 ${labelStyle}`}>
            {label}
            {required && (
              <span className="text-red-500 ml-1 -translate-y-[3px] inline-block">*</span>
            )}
          </span>
        </label>
      )}

      <input
        type={isPassword && !showPassword ? "password" : "text"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-[10px] dark:bg-stone-100 pr-10 py-2 h-10 border rounded-md focus:outline-none focus:ring focus:border-blue-100"
      />

      {isPassword && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={`absolute right-2 ${label ? "top-3/4 -translate-y-3/4" : "top-1/2 -translate-y-1/2"
            } transform text-gray-500`}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

export default InputField;
