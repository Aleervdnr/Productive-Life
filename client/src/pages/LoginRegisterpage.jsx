import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import { EmblaCarousel } from "../components/Carousel/EmblaCarousel";

function LoginRegisterpage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleSetIsLogin = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex">
      <div className="w-full lg:w-2/4 h-dvh flex flex-col justify-center gap-4 overflow-hidden">
        <div className="text-center">
          <h1 className="text-4xl font-semibold">
            Productive<span className="text-violet-main">Life</span>
          </h1>
          <span className="text-2xl font-semibold">Bienvenido</span>
        </div>
        <div
          className={`grid grid-cols-[100vw_100vw] lg:grid-cols-[50vw_50vw] justify-items-center transition-transform duration-500 ${
            isLogin ? "" : "translate-x-[-100%]"
          }`}
        >
          <LoginForm handleSetIsLogin={handleSetIsLogin} isLogin={isLogin} />
          <RegisterForm handleSetIsLogin={handleSetIsLogin} isLogin={isLogin} />
        </div>

        <div className="w-full flex justify-center">
          <a
            href="http://localhost:3000/auth/google"
            className="login-with-google-btn"
          >
            Sign in with Google
          </a>
        </div>
      </div>
      <div className="hidden lg:flex w-2/4 h-dvh bg-violet-main lg:items-center lg:justify-center ">
        <EmblaCarousel />
      </div>
    </div>
  );
}

export default LoginRegisterpage;
