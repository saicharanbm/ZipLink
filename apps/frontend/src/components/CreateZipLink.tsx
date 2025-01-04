import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateZipLinkMutation } from "../services/mutations";
import { toast } from "react-toastify";
import { ShortLinkPayload } from "../types";

function CreateZipLink() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShortLinkPayload>({ mode: "onChange" });
  const { mutate: CreateZipLink, isPending } = useCreateZipLinkMutation();
  const handleUpload: SubmitHandler<ShortLinkPayload> = (data) => {
    // Log file data
    console.log("Uploaded data:", data);

    toast.promise(
      new Promise<void>((resolve, reject) => {
        CreateZipLink(
          {
            url: data.url,
            slug: data.slug,
          },
          {
            onSuccess: (data) => {
              console.log(data);

              resolve();
            },
            onError: (error) => {
              console.log(error);
              reject(error);
            },
          }
        );
      }),
      {
        pending: "Creating course...",
        success: "ZipLink created successfully",
        error: {
          render({ data }: { data: string }) {
            console.log(data);
            return data;
          },
        },
      }
    );
  };
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] text-white flex justify-center items-center py-4 px-4 lg:px-24">
      <form
        onSubmit={handleSubmit(handleUpload)}
        className="w-full max-w-[90rem] bg-[#fbf7f4a6] rounded-lg p-8 shadow-custom flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-black text-center sm:text-4xl">
          Create ZipLink
        </h1>

        <div className="url-container">
          <label
            htmlFor="url"
            className="block text-sm font-semibold text-gray-600 mb-1 "
          >
            URL
          </label>
          <input
            type="text"
            id="url"
            {...register("url", {
              required: "URL is required",
              pattern: {
                value: /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/[^\s]*)?$/,
                message: "Please enter a valid URL",
              },
            })}
            placeholder="Enter a URL"
            className="w-full  text-black text-md rounded-lg p-3 border border-[#245e5a] focus:ring-1 focus:ring-[#004400] focus:outline-none"
          />
          {errors.url && <p className="text-red-500">{errors.url.message}</p>}
        </div>

        <div className="submit-container mt-4 flex justify-center">
          <button
            disabled={isPending}
            type="submit"
            className="bg-[#245e5a]  text-lg font-semibold rounded-lg py-3 px-6 hover:opacity-70 focus:outline-none"
          >
            {isPending ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateZipLink;
