import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};