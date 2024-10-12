import { useForm } from "react-hook-form";
import InputTaskForm from "./InputTaskForm";
import TextAreaTaskForm from "./TextAreaTaskForm";
import { useTasks } from "../../context/TasksContext";
import { todayDate, getHour } from "../../libs/Dates.js";
import { useEffect, useState } from "react";

export default function TaskForm({styles}) {
  const { register, handleSubmit, resetField, setValue } = useForm();
  const { createTask } = useTasks();
  const [hourAndMinutes, setHourAndMinutes] = useState("00:00");

  useEffect(() => {
    const { hour, minutes } = getHour();
    setHourAndMinutes(`${hour <= 9 ? `0${hour}` : hour}:${minutes}`);
  }, []);

  const onSubmit = (data) => {
    const {
      title,
      description,
      taskDate,
      startTime,
      recurringDays,
      endTime,
      recurringEndDate,
    } = data;

    const newTask = {
      title,
      description,
      taskDate,
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
      isRecurring: recurringDays.length >= 1 && true,
      recurringDays: recurringDays == false ? [] : recurringDays,
      recurringEndDate: !recurringEndDate ? taskDate : recurringEndDate,
    };
    createTask(newTask);
    resetField("title");
    resetField("description");
    setValue("taskDate", todayDate);
    setValue("recurringEndDate", todayDate);
    resetField("startTime");
    resetField("endTime");
  };

  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className={`bg-violet-main w-11 h-11 rounded-full text-2xl absolute bottom-5 right-5 lg:bottom-0 lg:right-0 lg:relative lg:w-fit lg:h-fit lg:py-[10px] lg:px-4 lg:text-xs lg:flex lg:m-0 lg:my-auto lg:justify-self-end ${styles} `}
        onClick={() => document.getElementById("my_modal_50").showModal()}
      >
        <span className="hidden lg:block lg:font-semibold">Agregar Tarea</span>
        <span className="lg:text-md lg:leading-3 lg:font-medium lg:pl-1 ">+</span>
      </button>
      <dialog id="my_modal_50" className="modal">
        <div className="modal-box bg-dark-400">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className=" text-lg">Nueva Tarea</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
            <div className="grid gap-2 mt-3">
              <InputTaskForm
                typeInput={"text"}
                placeholder={"Titulo"}
                name={"title"}
                required={true}
                register={register}
              />
              <TextAreaTaskForm
                rows={1}
                placeholder={"Descripcion"}
                name={"description"}
                register={register}
              />
            </div>
            <div className="flex">
              <div className="grid w-2/4">
                <label className="text-xs">Fecha Inicio</label>
                <input
                  type="date"
                  {...register("taskDate", { value: todayDate })}
                  required
                  min={todayDate}
                  // defaultValue={todayDate}
                  className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold"
                />
              </div>
              <div className="grid w-2/4">
                <label className="text-xs">Fecha Fin</label>
                <input
                  type="date"
                  min={todayDate}
                  {...register("recurringEndDate", { value: todayDate })}
                  className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold"
                />
              </div>
            </div>
            <div className="flex">
              <div className="grid w-2/4">
                <label>Hora Inicio</label>
                <input
                  type="time"
                  {...register("startTime", { value: hourAndMinutes })}
                  min={hourAndMinutes}
                  required
                  className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold"
                />
              </div>
              <div className="grid w-2/4">
                <label>Hora Fin</label>
                <input
                  type="time"
                  {...register("endTime", { value: hourAndMinutes })}
                  required
                  className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold"
                />
              </div>
            </div>
            <span>Repetir todos los</span>
            <div className="flex gap-2">
              <div>
                <input
                  type="checkbox"
                  value={1}
                  {...register("recurringDays")}
                />{" "}
                L
              </div>
              <div>
                <input
                  type="checkbox"
                  value={2}
                  {...register("recurringDays")}
                />{" "}
                M
              </div>
              <div>
                <input
                  type="checkbox"
                  value={3}
                  {...register("recurringDays")}
                />{" "}
                X
              </div>
              <div>
                <input
                  type="checkbox"
                  value={4}
                  {...register("recurringDays")}
                />{" "}
                J
              </div>
              <div>
                <input
                  type="checkbox"
                  value={5}
                  {...register("recurringDays")}
                />{" "}
                V
              </div>
              <div>
                <input
                  type="checkbox"
                  value={6}
                  {...register("recurringDays")}
                />{" "}
                S
              </div>
              <div>
                <input
                  type="checkbox"
                  value={0}
                  {...register("recurringDays")}
                />{" "}
                D
              </div>
            </div>
            <button>Guardar</button>
          </form>
        </div>
      </dialog>
    </>
  );
}
