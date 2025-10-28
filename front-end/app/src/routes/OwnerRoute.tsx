import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSpinner } from "react-icons/fa";

export const OwnerRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><FaSpinner /></div>;
  }

  const isOwner = isAuthenticated && user && user.role?.toUpperCase() === 'OWNER';

  if (!isOwner) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};