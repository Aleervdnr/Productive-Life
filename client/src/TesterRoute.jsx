import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

const TesterRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // O un loader si preferís

  if (!user) return <Navigate to="/login" />;
  if (!user.role == "tester" || !user.role =="admin") return <Navigate to="/tasks" />;

  return <Outlet />;
};

export default TesterRoute;
