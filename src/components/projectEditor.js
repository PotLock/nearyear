import { useForm } from "react-hook-form";
import Input from "./Input";

export const ProjectEditor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      // categories: [],
      // publicGoodReason: "",
    },
  });

  errors && console.log(errors);
  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="m-auto flex w-full max-w-[816px] flex-col p-[3rem_0px] md:p-[4rem_0px]">
        <div className="space-y-4">
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="projectName"
            >
              Project Name{" "}
                <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              {...register("name", {
                required: "Project name is required",
                minLength: {
                  value: 3,
                  message: "Project name must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Project name cannot exceed 50 characters",
                },
              })}
              className="w-full input"
              id="projectName"
            />
            {errors.name && (
              <span className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="projectDescription"
            >
              Project Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              {...register("description", {
                required: "Project description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              id="projectDescription"
              className="w-full input"
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Categories<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              {...register("categories", {
                required: "Please select at least one category"
              })}
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
            >
              <option value="web">Web Development</option>
              <option value="mobile">Mobile Development</option>
              <option value="ai">Artificial Intelligence</option>
              <option value="blockchain">Blockchain</option>
            </select>
            {errors.categories && (
              <span className="text-red-500 text-sm mt-1">
                {errors.categories.message}
              </span>
            )}
          </div> */}

          <input
            type="submit"
            className="btn align-self-center"
            value={"Create Project"}
          />
        </div>
      </div>
    </form>
  );
};
