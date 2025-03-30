import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmailRequest } from "../api/auth";
import { toast } from "sonner";
import logo from "../assets/Logo.png";
import InputForm from "../components/InputForm";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmailToken() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(0);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [loading]);

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
        const res = await verifyEmailRequest(token);
        toast.success(res.data.message); // Notificación de éxito
        navigate("/login"); // Redirige al login tras verificar
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error al verificar el email."
        );
        setStatus(error.status);
      }
    };

    verifyToken(); // Ejecuta la verificación al montar el componente
  }, [navigate]);
  return (
    <div className="w-full h-dvh grid place-content-center">
      {status == 401 && <VerifyEmail401Error />}
      {status == 500 && navigate("/")}
    </div>
  );
}

const VerifyEmail401Error = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { reSendEmailVerification } = useAuth();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleResend = async (values) => {
    if (timer === 0) {
      reSendEmailVerification(values, setTimer);
    }
  };
  return (
    <div className="w-[95vw] max-w-[750px] px-[2vw] lg:px-12  border-dark-100 bg-dark-400  py-8 grid justify-items-center gap-[10px] ">
      <img src={logo} alt="logo productive life" className="max-w-[250px] " />
      <div className="flex flex-col gap-0 items-center">
        <span className="text-xl font-semibold text-center">
          ⏳ ¡Ups! El enlace ha caducado
        </span>
        <span className="text-dark-100 text-sm text-center mt-2">
          Parece que tu enlace de verificación ya no es válido. ¡No te
          preocupes, podemos solucionarlo rápido! <br />
          Solo necesitas ingresar tu correo electrónico nuevamente y te
          enviaremos un nuevo enlace de verificación para que puedas continuar.
        </span>
      </div>

      <form
        onSubmit={handleSubmit(handleResend)}
        className="grid gap-2 mt-[15px] text-sm w-full max-w-96"
      >
        <InputForm
          typeInput={"email"}
          placeholder={"Ingrese su email"}
          name={"email"}
          register={register}
        />
        <button
          className="lg:w-fit lg:justify-self-end bg-violet-main disabled:bg-[#443D8C] disabled:text-dark-100 py-[5px] px-[15px] font-medium"
          disabled={timer > 0}
        >
          {timer > 0 ? `Reenviar en ${timer}s` : "Reenviar correo"}
        </button>
      </form>
    </div>
  );
};
