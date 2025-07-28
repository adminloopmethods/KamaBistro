// src/components/Spinner.jsx
const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="w-12 h-12 border-4 border-blue-500 border-b-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
