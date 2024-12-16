import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmailRequest } from '../api/auth';
import { toast } from "sonner";


export default function VerifyEmailToken() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(window.location.search); // Obtén los parámetros de la URL
      const token = params.get("token"); // Extrae el token de la URL

      if (!token) {
        toast.error("Token de verificación no encontrado.");
        return navigate("/"); // Redirige al login si no hay token
      }

      try {
        // Llama al backend para verificar el token
        const res = await verifyEmailRequest(token)
        toast.success(res.data.message); // Notificación de éxito
        navigate("/"); // Redirige al login tras verificar
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error al verificar el email."
        );
        navigate("/"); // Redirige al login en caso de error
      }
    };

    verifyToken(); // Ejecuta la verificación al montar el componente
  }, [navigate]);
  return <div>VerifyEmail</div>;
}
