import logo from "../assets/Logo.png";
import { useAuth } from "../context/AuthContext";
export default function VerifyEmailPage() {
  const { user } = useAuth();
  return (
    <div className="w-full h-[calc(100dvh-55px)] lg:h-screen  overflow-hidden relative grid place-content-center">
      <div className=" border-dark-100 bg-dark-400 px-12 py-8 grid justify-items-center gap-[10px] ">
        <img src={logo} alt="logo productive life" className="max-w-[250px] " />
        <div className="flex flex-col gap-0 items-center">
          <span className="text-base">Por Favor Verifica Tu Email</span>
          <span className="text-dark-100 text-sm">
          Revisa tu email y haz click en el link para verificar tu cuenta
          </span>
        </div>
        {/* <div className="flex gap-2 mt-[15px] text-sm">
          <button className="bg-violet-main py-[5px] px-[15px] font-medium">
            Reenviar Email
          </button>
          <button className="py-[5px] px-[15px] rounded font-medium">
            Cambiar Email
          </button>
        </div> */}
      </div>
    </div>
  );
}
