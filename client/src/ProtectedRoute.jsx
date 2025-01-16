import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading)
    return (
      <div className="h-dvh w-full grid place-content-center justify-items-center">
        <h1 className="text-2xl font-semibold">
          Productive<span className="text-violet-main">Life</span>
        </h1>
        <span className="loading loading-spinner text-primary"></span>{" "}
      </div>
    );
  if (!isAuthenticated && !loading) return <Navigate to="/" replace />;
  return <Outlet />;
};
