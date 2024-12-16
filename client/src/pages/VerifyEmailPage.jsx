import logo from "../assets/Logo.png";
export default function VerifyEmailPage() {
  return (
    <div className="w-full h-[calc(100dvh-55px)] lg:h-screen  overflow-hidden relative grid place-content-center">
      <div className=" rounded-xl border-dark-100 bg-dark-400 px-12 py-8 grid justify-items-center">
        <img src={logo} alt="logo productive life" className="max-w-[250px] " />
        <h2 className="py-3 text-lg">Por Favor Verifica Tu Email</h2>
        <p className="text-dark-100">Te hemos enviado un email </p>
        <p className="text-dark-100">Haz Click en el link para poder verificar tu cuenta</p>
        <div className="flex gap-2 mt-2">
            <button className="bg-violet-main py-1 px-3 rounded font-medium">Reenviar email</button>
            <button className="border border-dark-100 py-1 px-3 rounded font-medium">Editar email</button>
        </div>
      </div>
    </div>
  );
}
