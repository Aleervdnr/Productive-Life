import { useForm } from "react-hook-form";
import InputForm from "./InputForm";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import InputFormPassword from "./InputFormPassword";
import { useTranslation } from "../hooks/UseTranslation";

export default function LoginForm({ handleSetIsLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { t } = useTranslation();

  const { signin } = useAuth();

  const onSubmit = (values) => {
    signin(values);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 text-white w-full px-5 max-w-[350px]"
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">{t("login.email.label")}</label>
        <InputForm
          typeInput={"email"}
          placeholder={t("login.email.placeholder")}
          name={"email"}
          register={register}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">{t("login.password.label")}</label>{" "}
        <InputFormPassword
          typeInput={"password"}
          placeholder={t("login.password.placeholder")}
          name={"password"}
          register={register}
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs font-semibold text-dark-100">
          {t("login.dontHaveAccount")}{" "}
          <span
            onClick={handleSetIsLogin}
            className="text-violet-main cursor-pointer"
          >
            {t("login.signup")}
          </span>
        </p>
        <button className="bg-violet-main text-white text-sm px-4 py-[6px] rounded w-fit font-semibold">
          {t("login.signin")}
        </button>
      </div>
    </form>
  );
}
