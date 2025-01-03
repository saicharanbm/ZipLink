import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { userLogin, userSignUp, axiosInstance } from "./api";
import { SigninPayload, SignupPayload } from "../types";
import { queryClient } from "../main";

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (data: SignupPayload) => {
      try {
        const response = await userSignUp(data);
        return response.data.message;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Throw the server's error message
          throw error.response.data?.message || "An unknown error occurred";
        }
        // For non-Axios errors
        throw "An unexpected error occurred";
      }
    },
  });
};
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: SigninPayload) => {
      try {
        const response = await userLogin(data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Throw the server's error message
          throw error.response.data?.message || "An unknown error occurred";
        }
        // For non-Axios errors
        throw "An unexpected error occurred";
      }
    },
    onSuccess: (data: { accessToken: string }) => {
      const { accessToken: token } = data;
      // add the access token to axios instance headers
      axiosInstance.defaults.headers.authorization = `Bearer ${token}`;
      //refresh the user data to update the global state
      //   queryClient.setQueryData(["auth", "user"], (oldData: any) => {
      //     // Return the updated data based on the old data
      //     return {
      //       ...oldData, // Preserve existing data
      //       newValue: "New Value", // Add or update specific fields
      //     };
      //   });

      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });
};
