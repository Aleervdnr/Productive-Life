import { createContext, useState, useContext, useEffect } from "react";
import {
  loginRequest,
  registerRequest,
  reSendEmailRequest,
  verifyTokenRequest,
} from "../api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { completeTourRequest } from "../api/auth.js";
import {useTranslation} from "../hooks/UseTranslation.jsx"

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
  const navigate = useNavigate();

  const {t} = useTranslation()

  useEffect(() => {
    const checkLogin = async () => {
      const session = { token: localStorage.getItem("token") };

      if (!session.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(session.token);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  const signup = async (user) => {
    try {
      await registerRequest(user);
      setUser({ email: user.email, name: user.name });
      navigate("/verify-email");
    } catch (error) {
      const data = error.response?.data;
  
      // Zod errors
      if (Array.isArray(data?.errors)) {
        data.errors.forEach((err) =>
          toast.error(t(`login.errors.${err.message}`), {
            duration: 3000,
          })
        );
        return;
      }
  
      // Errores con código (EMAIL_IN_USE, etc)
      if (data?.code) {  
        toast.error(t(`login.errors.${data.code}`), {
          duration: 3000,
        });
  
        return;
      }
  
      // Si no tiene estructura conocida
      toast.error("Ocurrió un error inesperado", {
        duration: 3000,
      });
    }
  };
  

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log(res);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(true)
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      const data = error.response?.data;
  
      // Zod errors
      if (Array.isArray(data?.errors)) {
        data.errors.forEach((err) =>
          toast.error(t(`login.errors.${err.message}`), {
            duration: 3000,
          })
        );
        return;
      }
  
      // Errores con código (EMAIL_IN_USE, etc)
      if (data?.code) {  
        toast.error(t(`login.errors.${data.code}`), {
          duration: 3000,
        });
  
        return;
      }
  
      // Si no tiene estructura conocida
      toast.error("Ocurrió un error inesperado", {
        duration: 3000,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const reSendEmailVerification = async (user,setTimer) => {
    try {
      const res = await reSendEmailRequest(user);
      toast.info("El correo de verificación se ha reenviado.");
      setTimer(60)
    } catch (error) {
      error.response.data.map((error) =>
        toast.error(error, {
          duration: 3000,
        })
      );
    }
  };

  const completeTour = async (tourType) => {
    try {
      const response = await completeTourRequest(tourType, user._id);
      console.log(`Estado de ${tourType} actualizado:`, response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error(`Error al actualizar ${tourType}:`, error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        reSendEmailVerification,
        completeTour,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
