import React from 'react';

const InputField = ({ header, type, placeholder, value, onChange, name, error }) => {
  return (
    <div className="mb-4">
      {header && <h3 className="text font-medium text-gray-700 mb-1">{header}</h3>}
      <input
        type={type}
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md pl-3 py-2 w-96 text-gray-700"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}  // Add the name attribute here
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default InputField;
