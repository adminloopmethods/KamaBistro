import React from 'react';

const SubmitButton = ({ onClick, label, className }) => {
  const styles = className || "w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
  return (
    <button
      onClick={onClick}
      className={styles}
    >
      {label}
    </button>
  );
};

export default SubmitButton;