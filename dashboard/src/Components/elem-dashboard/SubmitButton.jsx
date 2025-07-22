import React from 'react';

const SubmitButton = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
    >
      {label}
    </button>
  );
};

export default SubmitButton;