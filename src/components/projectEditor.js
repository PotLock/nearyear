import { use, useEffect } from "react";
import { FormField } from "./FormField";
import { useProjectForm } from "@/hooks/useProjectForm";

export const ProjectEditor = () => {
  const { form, profile, isLoading, onSubmit } = useProjectForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const values = form.watch();

  useEffect(() => {
    if (profile) {
      form.setValue("name", profile.name);
      form.setValue("description", profile.description);
    }
  }, [profile, form]);


  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="m-auto flex w-full max-w-[816px] flex-col p-[1rem_0px] md:p-[2rem_0px]">
          <div className="space-y-4">
            <FormField label="Project Name" error={errors.name?.message}>
              <input
                {...register("name", {
                  required: "Project name is required",
                  minLength: {
                    value: 3,
                    message: "Project name must be at least 3 characters",
                  },
                })}
                className="w-full input"
                defaultValue={values.name}
                onChange={(e) => {
                  form.setValue("name", e.target.value);
                }}
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
                className="w-full input"
                defaultValue={values.description}
                onChange={(e) => {
                  form.setValue("description", e.target.value);
                }}
              />
            </FormField>
            <button
              type="submit"
              className="btn align-self-center"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
