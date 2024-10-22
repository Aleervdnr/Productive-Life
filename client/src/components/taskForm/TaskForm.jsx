import { useForm } from "react-hook-form";

import { useTasks } from "../../context/TasksContext";
import { useDate } from "../../context/DateContext.jsx";
import { isBefore } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export default function TaskForm({ styles }) {
  const { register, handleSubmit, resetField, setValue, watch } = useForm();
  const { nowDate } = useDate();
  const { createTask } = useTasks();
  const dialog = document.getElementById("my_modal_50");
  const selectedTaskDate = watch("taskDate");
  const selectedTaskEndDate = watch("recurringEndDate");

  const handleSelectedDate = (e) => {
    const selectedDate = e.target.value;

    // Actualizamos el valor de react-hook-form
    setValue("taskDate", selectedDate);

    // Verificamos si la fecha de fin es válida
    if (
      selectedTaskEndDate &&
      isBefore(new Date(selectedTaskEndDate), new Date(selectedDate))
    ) {
      setValue("recurringEndDate", ""); // Resetear la fecha de fin si es inválida
    }
  };

  const handleSelectedEndDate = (e) => {
    setValue("recurringEndDate", e.target.value); // Actualizar la fecha de fin
  };

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
      description: description ? description : "",
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
    setValue("taskDate", nowDate);
    setValue("recurringEndDate", nowDate);
    resetField("startTime");
    resetField("endTime");
    dialog.close();
  };
  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className={`bg-violet-main w-11 h-11 rounded-full text-2xl absolute bottom-5 right-5 lg:bottom-0 lg:right-0 lg:relative lg:w-fit lg:h-fit lg:py-[10px] lg:px-4 lg:text-xs lg:flex lg:m-0 lg:my-auto lg:justify-self-end ${styles} `}
        onClick={() => document.getElementById("my_modal_50").showModal()}
      >
        <span className="hidden lg:block lg:font-semibold">Agregar Tarea</span>
        <span className="lg:text-md lg:leading-3 lg:font-medium lg:pl-1 ">
          +
        </span>
      </button>
      <dialog id="my_modal_50" className="modal">
        <div className="modal-box bg-dark-400">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="text-lg mb-2">Nueva Tarea</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-[repeat(2,fit-content)] gap-2"
          >
            <div className="grid grid-rows-[16px,30px] col-span-2 lg:col-span-1 ">
              <label className="text-xs w-fit">Titulo</label>
              <InputTaskForm
                typeInput={"text"}
                placeholder={"Titulo"}
                name={"title"}
                required={true}
                register={register}
              />
            </div>
            <div className="grid col-span-2 lg:col-span-1">
              <label className="text-xs">Descripcion</label>
              <TextAreaTaskForm
                rows={3}
                placeholder={"Descripcion"}
                name={"description"}
                register={register}
              />
            </div>
            <div className="grid w-2/4">
              <label className="text-xs">Fecha Inicio</label>
              <input
                type="date"
                {...register("taskDate", { value: selectedTaskDate })}
                min={nowDate}
                onChange={(e) => handleSelectedDate(e)}
                required
                className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold"
              />
            </div>
            <div className="grid w-2/4">
              <label className="text-xs">Fecha Fin</label>
              <input
                type="date"
                min={selectedTaskDate}
                value={selectedTaskEndDate}
                onChange={(e) => handleSelectedEndDate(e)}
                {...register("recurringEndDate")}
                className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold"
              />
            </div>

            <div className="grid w-2/4">
              <label className="text-xs">Hora Inicio</label>
              <input
                type="time"
                {...register("startTime")}
                required
                className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold"
              />
            </div>
            <div className="grid w-2/4">
              <label className="text-xs">Hora Fin</label>
              <input
                type="time"
                {...register("endTime")}
                required
                className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold"
              />
            </div>
            <div className="col-span-2">
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
            </div>
            <button>Guardar</button>
          </form>
        </div>
      </dialog>
    </>
  );
}
