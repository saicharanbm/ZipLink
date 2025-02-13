import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  userLogin,
  userSignUp,
  axiosInstance,
  userLogout,
  createZipLink,
  deleteZipLink,
} from "./api";
import { zipLinkPayload, SigninPayload, SignupPayload } from "../types";
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
    onSuccess: (data: {
      accessToken: string;
      user: { id: string; email: string; name: string };
    }) => {
      const { accessToken: token, user } = data;
      // add the access token to axios instance headers
      axiosInstance.defaults.headers.authorization = `Bearer ${token}`;

      queryClient.setQueryData(["auth", "user"], user);

      // queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await userLogout();
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
    onSuccess: () => {
      //clear the query cache
      queryClient.clear();
      //clear the axios instance auth headers
      axiosInstance.defaults.headers.authorization = "";
    },
  });
};

export const useCreateZipLinkMutation = () => {
  return useMutation({
    mutationFn: async (data: zipLinkPayload) => {
      try {
        const response = await createZipLink(data);
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
  });
};

export const useDeleteZipLink = () => {
  return useMutation({
    mutationFn: async ({ slug, search }: { slug: string; search: string }) => {
      try {
        const response = await deleteZipLink(slug);
        queryClient.invalidateQueries({ queryKey: ["links", search] });
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
  });
};
