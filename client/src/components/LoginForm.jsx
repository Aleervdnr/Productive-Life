import { useForm } from "react-hook-form";
import InputForm from "./InputForm";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import InputFormPassword from "./InputFormPassword";

export default function LoginForm({ handleSetIsLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signin } = useAuth();

  const onSubmit = (values) => {
    signin(values);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 text-white w-full px-5 max-w-[350px]"
    >
      {errors.email && (
        <p className="text-xs text-red-600 bg-gray-600 p-1 w-fit rounded-md">
          email is required
        </p>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Email</label>
        <InputForm
          typeInput={"email"}
          placeholder={"Ingrese su email"}
          name={"email"}
          register={register}
        />
      </div>
      {errors.password && (
        <p className="text-xs text-red-600 bg-gray-600 p-1 w-fit rounded-md">
          Password is required
        </p>
      )}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">Contraseña</label>{" "}
        <InputFormPassword
          typeInput={"password"}
          placeholder={"Ingrese su contraseña"}
          name={"password"}
          register={register}
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs font-semibold text-dark-100">
          No tienes cuenta?{" "}
          <span
            onClick={handleSetIsLogin}
            className="text-violet-main cursor-pointer"
          >
            Registrate
          </span>
        </p>
        <button className="bg-violet-main text-white text-sm px-4 py-[6px] rounded w-fit font-semibold">
          Ingresar
        </button>
      </div>
    </form>
  );
}
