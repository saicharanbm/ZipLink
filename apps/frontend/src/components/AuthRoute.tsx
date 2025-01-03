import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import Spinner from "./shimmer/Spinner";

const AuthRoute = ({
  children,
  isProtected = true,
}: {
  children: JSX.Element;
  isProtected: boolean;
}) => {
  const { userData, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (isProtected && !userData) {
    return <Navigate to={ROUTES.fallback} />;
  }

  if (!isProtected && userData) {
    return <Navigate to={ROUTES.home} />;
  }

  return children;
};

export default AuthRoute;
