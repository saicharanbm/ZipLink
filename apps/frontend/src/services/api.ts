import axios from "axios";
import { queryClient } from "../main";
import { zipLinkPayload, SigninPayload, SignupPayload } from "../types";

const baseURL = "http://localhost:3000/api/v1/";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Correct way to include cookies
});

axiosInstance.interceptors.response.use(
  (response) => response, // Return response for successful requests
  async (error) => {
    const originalRequest = error.config;
    console.log(error.response?.data);

    // Check for 401 status and specific error message
    if (
      error.response?.status === 401 &&
      (error.response?.data?.message === "Unauthorized: Token expired" ||
        error.response?.data?.message === "Unauthorized: No token provided") &&
      !originalRequest._retry // Ensure no infinite loops
    ) {
      console.log("Token expired. Attempting refresh...");
      //if the original fails again we and directly return the error.
      originalRequest._retry = true;

      try {
        const refreshAxios = axios.create({
          baseURL: axiosInstance.defaults.baseURL,
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const refreshResponse = await refreshAxios.post("/auth/get-token");
        console.log(refreshResponse.data);
        const newAccessToken = refreshResponse.data.token;

        // Update global axios instance and the original request with the new token
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clear cached user data and redirect to login
        queryClient.setQueryData(["auth", "user"], null);
        throw refreshError; // Re-throw to propagate the error
      }
    }

    // Reject other errors
    return Promise.reject(error);
  }
);

export const userSignUp = async (data: SignupPayload) => {
  return axiosInstance.post("/auth/signup", data);
};

export const userLogin = async (data: SigninPayload) => {
  return axiosInstance.post("/auth/login", data);
};

export const userLogout = async () => {
  return axiosInstance.post("/auth/signout");
};

export const fetchUserData = () => {
  return axiosInstance.get("/user");
};

export const createZipLink = async (data: zipLinkPayload) => {
  return axiosInstance.post("/zipLink", data);
};

export const deleteZipLink = async (slug: string) => {
  return axiosInstance.delete(`/zipLink/${slug}`);
};

export const getAllLinks = async (param?: string) => {
  if (param) {
    return axiosInstance.get(`/zipLinks/search?query=${param}`);
  }
  return axiosInstance.get("/zipLinks");
};
