import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateZipLinkMutation } from "../services/mutations";
import { toast } from "react-toastify";
import { zipLinkPayload } from "../types";

function CreateZipLink() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<zipLinkPayload>({ mode: "onChange" });
  const { mutate: CreateZipLink, isPending } = useCreateZipLinkMutation();
  const handleUpload: SubmitHandler<zipLinkPayload> = (data) => {
    const payload: { url: string; slug?: string } = { url: data.url };

    // Add slug only if it's not empty
    if (data.slug && data.slug.trim() !== "") {
      payload.slug = data.slug.trim();
    }

    toast.promise(
      new Promise<{ message: string; zipLink: string }>((resolve, reject) => {
        CreateZipLink(payload, {
          onSuccess: (data: { message: string; zipLink: string }) => {
            console.log(data);

            resolve(data);
          },
          onError: (error) => {
            console.log(error);
            reject(error);
          },
        });
      }),
      {
        pending: "Creating zipLink...",
        success: {
          render({ data }: { data: { message: string; zipLink: string } }) {
            console.log(data);
            return `${data.message} \n ZipLink: ${data.zipLink}`;
          },
        },
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
                value: /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/[^\s]*)?$/i,
                message: "Please enter a valid URL",
              },
            })}
            placeholder="Enter a URL"
            className="w-full  text-black text-md rounded-lg p-3 border border-[#245e5a] focus:ring-1 focus:ring-[#004400] focus:outline-none"
          />
          {errors.url && <p className="text-red-500">{errors.url.message}</p>}
        </div>
        <div className="slug-container">
          <label
            htmlFor="slug"
            className="block text-sm font-semibold text-gray-600 mb-1 "
          >
            Slug (optional)
          </label>
          <input
            type="text"
            id="slug"
            {...register("slug", {
              minLength: {
                value: 5,
                message: "Slug must be at least 5 characters",
              },
            })}
            placeholder="Enter a slug"
            className="w-full  text-black text-md rounded-lg p-3 border border-[#245e5a] focus:ring-1 focus:ring-[#004400] focus:outline-none"
          />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
        </div>
        <div className="submit-container mt-4 flex justify-center">
          <button
            disabled={isPending}
            type="submit"
            className={`bg-[#245e5a] text-lg font-semibold rounded-lg py-3 px-6 ${
              isPending ? "opacity-50 cursor-not-allowed" : "hover:opacity-70"
            } focus:outline-none`}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <span>Creating...</span>
                <div className="spinner"></div> {/* Add spinner CSS */}
              </div>
            ) : (
              "Create ZipLink"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateZipLink;
