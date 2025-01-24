export const FormField = ({ label, error, children}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
    {children}
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);
