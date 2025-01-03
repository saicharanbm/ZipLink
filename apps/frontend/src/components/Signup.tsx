import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { SignupPayload } from "../types";
import { useSignupMutation } from "../services/mutations";
import { toast } from "react-toastify";
// import { usePostSignup } from "../services/mutations";
// import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(false); // For password visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupPayload>({ mode: "onChange" });

  const { mutate: signup, isPending } = useSignupMutation();
  //   const navigate = useNavigate();

  const handleSignup: SubmitHandler<SignupPayload> = (data) => {
    console.log(data);
    toast.promise(
      new Promise<void>((resolve, reject) => {
        signup(data, {
          onSuccess: (data) => {
            console.log("Signup successful");
            console.log(data);
            // navigate("/login");
            resolve();
          },
          onError: (error) => {
            console.log("Signup failed");
            console.log(error);
            reject(error);
          },
        });
      }),
      {
        pending: "Signing up...",
        success: "Signup successful!",
        error: {
          render({ data }: { data: string }) {
            console.log(data);
            return (data as string) || "Signup failed!";
          },
        },
      }
    );
    // signup(data, {
    //   onSuccess: (data) => {
    //     console.log("Signup successful");
    //     console.log(data);
    //     navigate("/login");
    //   },
    //   onError: (error) => {
    //     console.log("Signup failed");
    //     console.log(error);
    //   },
    // });
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] text-white flex justify-center items-center py-4">
      <div className="w-full max-w-md bg-[#1C1C1E] rounded-lg p-8 shadow-zinc-900">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Sign Up
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit(handleSignup)}>
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters long",
                },
              })}
              placeholder="Enter your Name"
              className="w-full bg-[#2C2C2E] text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none "
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              placeholder="Enter your email"
              className="w-full bg-[#2C2C2E] text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
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
                className="w-full bg-[#2C2C2E] text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
              />
              <div
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
              >
                {passwordVisible ? <FaEyeSlash /> : <IoEyeSharp />}
              </div>
            </div>

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              //   disabled={isPending}
              className="w-full bg-[#F89A28] hover:opacity-70  text-black text-lg font-semibold py-3 rounded-lg transition duration-300"
            >
              {isPending ? "Signing up..." : "Signup"}
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#F89A28] font-semibold hover:underline "
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
