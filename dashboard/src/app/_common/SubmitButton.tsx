// SubmitButton.tsx
import React from "react";

type SubmitButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label: string;
  isLoading?: boolean;
  className?: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  label,
  isLoading = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full py-3 bg-[#AE9060] text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-2 focus:ring-[#AE9060]/50 focus:ring-offset-2 ${
        isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#9c7d52]"
      } ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {label}...
        </div>
      ) : (
        label
      )}
    </button>
  );
};

export default SubmitButton;
