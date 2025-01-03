import { useEffect, useState } from "react";
import logo from "../assets/Logo.png";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


export default function VerifyEmailPage() {
  const [timer, setTimer] = useState(60);
  const { user, reSendEmailVerification } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if(!user){navigate("/")}

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleResend = () => {
    if (timer === 0) {
      reSendEmailVerification(user)
      toast.info("El correo de verificación se ha reenviado.");
      setTimer(60); // Reiniciar el temporizador
    }
  };

  return (
    <div className="w-full h-[calc(100dvh-55px)] lg:h-screen  overflow-hidden relative grid place-content-center">
      <div className="w-[95vw] max-w-[750px] px-[2vw] lg:px-12  border-dark-100 bg-dark-400  py-8 grid justify-items-center gap-[10px] ">
        <img src={logo} alt="logo productive life" className="max-w-[250px] " />
        <div className="flex flex-col gap-0 items-center">
          <span className="text-xl font-semibold">¡Gracias por registrarte!</span>
          <span className="text-dark-100 text-sm text-center mt-2">
            Hemos enviado un correo de verificación a <span className="font-semibold text-white">{user?.email}</span>. Por
            favor, revisa tu bandeja de entrada y haz clic en el enlace para
            activar tu cuenta.
          </span>
        </div>

        <div className="flex gap-2 mt-[15px] text-sm">
          <button
            className="bg-violet-main disabled:bg-[#443D8C] disabled:text-dark-100 py-[5px] px-[15px] font-medium"
            disabled={timer > 0}
            onClick={handleResend}
          >
            {timer > 0 ? `Reenviar en ${timer}s` : "Reenviar correo"}
          </button>
          <button className="py-[5px] px-[15px] rounded font-medium">
            Cambiar Email
          </button>
        </div>
      </div>
    </div>
  );
}
