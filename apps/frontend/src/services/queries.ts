import { useQuery } from "@tanstack/react-query";
import { fetchUserData } from "./api";
export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const response = await fetchUserData();
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
