import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { verifyTokenRequest } from "../api/auth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      console.error("No se recibió un token válido.");
      navigate("/"); // Redirige al inicio si no hay token
      return;
    }

    // Verificar el token en el backend
    const verifyAndLogin = async () => {
      try {
        const res = await verifyTokenRequest(token);

        if (!res.status == 200) {
          console.error("Token inválido o expirado.");
          navigate("/");
          return;
        }
        
        console.log(res)
        // Actualizar el estado global con los datos del usuario
        setUser(res.data);
        setIsAuthenticated(true)

        // Guardar el token en localStorage (opcional)
        localStorage.setItem("token", token);

        // Redirigir al dashboard
        navigate("/tasks");
      } catch (error) {
        console.error("Error al verificar el token:", error);
        navigate("/");
      }
    };

    verifyAndLogin();
  }, []);

  return (
    <div className="h-dvh w-full grid place-content-center justify-items-center">
      <span className="loading loading-spinner text-primary"></span>
      <p>Autenticando...</p>
    </div>
  );
};

export default AuthCallback;