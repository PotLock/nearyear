import { useEffect } from "react";
import { FormField } from "./FormField";
import { useProjectForm } from "@/hooks/useProjectForm";
import { useWatch } from "react-hook-form";

export const ProjectEditor = () => {
  const { form, socialProfileSnapshot, isLoading, onSubmit, isThereChanges } =
    useProjectForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const values = useWatch(form);

  useEffect(() => {
    if (socialProfileSnapshot) {
      form.setValue("name", socialProfileSnapshot.name);
      form.setValue("description", socialProfileSnapshot.description);
    }
  }, [socialProfileSnapshot, form]);

  if (!socialProfileSnapshot) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg"
      >
        <div className="space-y-6">
          <FormField label="Project Name" error={errors.name?.message}>
            <input
              {...register("name", {
                required: "Project name is required",
                minLength: {
                  value: 3,
                  message: "Project name must be at least 3 characters",
                },
              })}
              className={`w-full border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out bg-gray-100 hover:bg-gray-200 shadow-sm hover:shadow-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              defaultValue={values.name}
              onChange={(e) => {
                form.setValue("name", e.target.value);
              }}
              placeholder="Enter your project name"
            />
          </FormField>
          <FormField
            label="Project Description"
            error={errors.description?.message}
          >
            <textarea
              {...register("description", {
                required: "Project description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              className={`w-full border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out bg-gray-100 hover:bg-gray-200 shadow-sm hover:shadow-md ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              defaultValue={values.description}
              onChange={(e) => {
                form.setValue("description", e.target.value);
              }}
              placeholder="Describe your project"
              rows="4"
            />
          </FormField>
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:shadow-lg ${
              isLoading || !isThereChanges
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={isLoading || !isThereChanges}
          >
            {isLoading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};
