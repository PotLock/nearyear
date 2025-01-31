export const FormField = ({ label, error, children }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <div
      className={`transition duration-300 ease-in-out ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    >
      {children}
    </div>
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);
