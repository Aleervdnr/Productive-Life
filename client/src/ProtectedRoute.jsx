import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import logo from "./assets/logo.png"

export const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading)
    return (
      <div className="h-dvh w-full grid place-content-center justify-items-center">
        <img src={logo} alt="logo productive life" className="max-w-[150px] " />
        <span className="loading loading-spinner text-primary"></span>{" "}
      </div>
    );
  if (!isAuthenticated && !loading) return <Navigate to="/" replace />;
  return <Outlet />;
};
