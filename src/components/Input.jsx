import React from "react";

const Input = ({ label, name, required, validation = null, register, error }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      {...register(name, {
        required: required && "This field is required",
        ...validation,
      })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {!!error && (
      <span className="text-red-500 text-sm mt-1">{error.message}</span>
    )}
  </div>
);

export default Input;
