import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import InputForm from "./InputForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputFormPassword from "./InputFormPassword";
import { useTranslation } from "../hooks/UseTranslation";

function RegisterForm({ handleSetIsLogin, isLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) navigate("/tasks");
  }, [isAuthenticated]);

  const onSubmit = async (values) => {
    signup({ ...values, lang: localStorage.getItem("language") });
    //setUser({name:values.name, email:values.email})
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 text-white w-full px-5 max-w-[350px]"
    >

      <div className="grid gap-1">
        <label className="text-sm font-semibold">{t("login.name.label")}</label>
        <InputForm
          typeInput={"text"}
          placeholder={t("login.name.placeholder")}
          name={"name"}
          register={register}
          tabIndexValue={isLogin ? -1 : 1}
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-semibold">{t("login.email.label")}</label>
        <InputForm
          typeInput={"email"}
          placeholder={t("login.email.placeholder")}
          name={"email"}
          register={register}
          tabIndexValue={isLogin ? -1 : 2}
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-semibold">{t("login.password.label")}</label>
        <InputFormPassword
          typeInput={"password"}
          placeholder={t("login.password.placeholder")}
          name={"password"}
          register={register}
          tabIndexValue={isLogin ? -1 : 3}
        />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs font-semibold text-dark-100">
          {t("login.haveAnAccount")}{" "}
          <span
            onClick={handleSetIsLogin}
            className="text-violet-main cursor-pointer"
          >
            {t("login.signin")}
          </span>
        </p>
        <button
          className="bg-violet-main text-white text-sm px-4 py-[6px] rounded w-fit font-semibold"
          tabIndex={isLogin ? -1 : 4}
        >
          {t("login.signup")}
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
