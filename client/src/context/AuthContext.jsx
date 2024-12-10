import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, registerRequest, verifyTokenRequest } from "../api/auth";
import { toast } from "sonner";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth necesita ser usado dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const session = { token: localStorage.getItem("token") };
      console.log(session);
      if (!session.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(session.token);
        if (!res.data) return setIsAuthenticated(false);
        console.log(res.data);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      error.response.data.map((error) =>
        toast.error(error, {
          duration: 3000,
        })
      );
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      error.response.data.map((error) =>
        toast.error(error, {
          duration: 3000,
        })
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ signup, signin, logout, user, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
