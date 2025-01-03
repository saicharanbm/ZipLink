import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { useLoginMutation } from "../services/mutations";
import { SigninPayload } from "../types";
import { useNavigate } from "react-router-dom";
// import { usePostLogin } from "../services/mutations";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

function Login() {
  const { mutate: login, isPending } = useLoginMutation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninPayload>({ mode: "onChange" });
  const navigate = useNavigate();

  const handlLogin: SubmitHandler<SigninPayload> = (data) => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        login(data, {
          onSuccess: (data) => {
            console.log("Login successful");
            console.log(data);
            navigate("/");
            resolve();
          },
          onError: (error) => {
            console.log("Login failed");
            console.log(error);
            reject(error);
          },
        });
      }),
      {
        pending: "Logging in...",
        success: "Login successful!",
        error: {
          render({ data }: { data: string }) {
            console.log(data);
            return (data as string) || "Login failed!";
          },
        },
      }
    );
  };
  return (
    <div className="w-full min-h-[calc(100vh-4rem)]  text-white flex justify-center items-center">
      <div className="w-full max-w-md bg-[#fbf7f4a6]  rounded-lg p-8 shadow-custom">
        <h1 className="text-3xl font-semibold text-black text-center mb-6">
          Login
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit(handlLogin)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter your email"
              className="w-full  text-black text-md rounded-lg p-3 border border-[#245e5a] focus:ring-1 focus:ring-[#004400] focus:outline-none"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>

            <div className="relative w-full">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Create a password"
                className="w-full  text-black rounded-lg p-3 border border-[#245e5a] focus:ring-1 focus:ring-[#004400] focus:outline-none pr-10"
              />
              <div
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#004400]"
              >
                {passwordVisible ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <IoEyeSharp size={18} />
                )}
              </div>
            </div>

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
            {/* {error && (
              <p className="text-sm text-red-500">
                {error as unknown as string}
              </p>
            )} */}
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#245e5a] hover:opacity-90 hover:text-gray-200 text-white text-lg font-semibold py-3 rounded-lg transition duration-300"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-500 text-center mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#245e5a] font-semibold hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
