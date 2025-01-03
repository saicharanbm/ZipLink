import { useEffect } from "react";
import { useAuthQuery } from "../services/queries";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: userData, isError, isLoading } = useAuthQuery();

  useEffect(() => {
    if (isLoading) return;
    const { pathname } = location;
    if (!userData) {
      //if the user is not logged in and trying to access a protected route redirect him to the login page
      if (ROUTES.protected.includes(pathname)) {
        navigate(ROUTES.fallback);
      }
    } else {
      //if the user is logged in and trying to access a public(signup or signin page) route redirect him to the home page
      if (ROUTES.public.includes(pathname)) {
        navigate(ROUTES.home);
      }
    }
  }, [isError, isLoading, navigate, location, userData]);

  return { userData, isError, isLoading };
};

export default useAuth;
