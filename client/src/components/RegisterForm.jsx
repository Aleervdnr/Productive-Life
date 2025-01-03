import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import InputForm from "./InputForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputFormPassword from "./InputFormPassword";

function RegisterForm({ handleSetIsLogin, isLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/tasks");
  }, [isAuthenticated]);

  const onSubmit = async (values) => {
    signup(values);
    //setUser({name:values.name, email:values.email})
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 text-white w-full px-5 max-w-[350px]"
    >
      {errors.name && (
        <p className="text-xs text-red-600 bg-gray-600 p-1 w-fit rounded-md">
          username is required
        </p>
      )}
      <div className="grid gap-1">
        <label className="text-sm font-semibold">Nombre</label>
        <InputForm
          typeInput={"text"}
          placeholder={"Ingrese su nombre"}
          name={"name"}
          register={register}
          tabIndexValue={isLogin ? -1 : 1}
        />
      </div>
      {errors.email && (
        <p className="text-xs text-red-600 bg-gray-600 p-1 w-fit rounded-md">
          email is required
        </p>
      )}
      <div className="grid gap-1">
        <label className="text-sm font-semibold">Email</label>
        <InputForm
          typeInput={"email"}
          placeholder={"Ingrese su email"}
          name={"email"}
          register={register}
          tabIndexValue={isLogin ? -1 : 2}
        />
      </div>
      {errors.password && (
        <p className="text-xs text-red-600 bg-gray-600 p-1 w-fit rounded-md">
          Password is required
        </p>
      )}
      <div className="grid gap-1">
        <label className="text-sm font-semibold">Contraseña</label>
        <InputFormPassword
          typeInput={"password"}
          placeholder={"Ingrese su contraseña"}
          name={"password"}
          register={register}
          tabIndexValue={isLogin ? -1 : 3}
        />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs font-semibold text-dark-100">
          Ya tenes cuenta?{" "}
          <span
            onClick={handleSetIsLogin}
            className="text-violet-main cursor-pointer"
          >
            Inicia Sesion
          </span>
        </p>
        <button
          className="bg-violet-main text-white text-sm px-4 py-[6px] rounded w-fit font-semibold"
          tabIndex={isLogin ? -1 : 4}
        >
          Registrar
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
