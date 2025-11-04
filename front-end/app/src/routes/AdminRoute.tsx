import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Verificando permissões...</div>;
  }

  if (!isAuthenticated || !user || user.role?.toUpperCase() !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
