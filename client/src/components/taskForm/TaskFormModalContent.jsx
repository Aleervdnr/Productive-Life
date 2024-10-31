import { format, isDate, isSameDay } from "date-fns";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useForm } from "react-hook-form";
import { useTasks } from "../../context/TasksContext.jsx";
import InputTaskForm from "./InputTaskForm.jsx";
import TextAreaTaskForm from "./TextAreaTaskForm.jsx";
import ItemRecurrent from "../ItemRecurrent.jsx";
import { BackButton, NextButton, SaveButton } from "./ButtonsTaskForm.jsx";

export default function TaskFormModalContent({ step, setStep }) {
  // Day Picker
  const pastMonth = new Date();

  const defaultSelected = {
    from: pastMonth,
    to: pastMonth,
  };

  const [selected, setSelected] = useState(defaultSelected);

  let footer = <p>Please pick the first day.</p>;
  if (selected?.from) {
    if (!selected.to) {
      footer = <p>Desde el{format(selected.from, "yyyy-MM-dd")}</p>;
    } else if (selected.to) {
      footer = (
        <p className="text-xs md:text-sm text-center mt-2">
          <span>Desde el </span>
          <span className="text-violet-main font-medium">
            {format(selected.from, "dd/MM/yyyy")}{" "}
          </span>
          <span>- Hasta el </span>
          <span className="text-violet-main font-medium">
            {format(selected.to, "dd/MM/yyyy")}
          </span>
        </p>
      );
    }
  }

  //React-Hook-Form
  const { register, handleSubmit, resetField, watch } = useForm();

  const titleText = watch("title");
  const startTime = watch("startTime");

  //Context Tasks
  const {
    createTask,
    handleCheckRecurringDays,
    generateRecurrences
  } = useTasks();

  //Modal
  const dialog = document.getElementById("my_modal_50");

  //Handle Submit
  const onSubmit = (data) => {
    const { title, description, startTime, endTime } = data;

    const recurringDays = recurringDaysArray
      .filter((item) => item.status == true)
      .map((item) => item.status == true && item.isoDay);

    const recurrentTasks = (generateRecurrences(format(selected.from, "yyyy-MM-dd"),format(selected.to, "yyyy-MM-dd"),recurringDays,`${startTime}:00`,`${endTime}:00`))

    const newTask = {
      title,
      description: description ? description : "",
      taskDate: format(selected.from, "yyyy-MM-dd"),
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
      isRecurring: recurringDays.length >= 1 && true,
      recurringDays: recurringDays ? recurringDays : [],
      recurringEndDate: format(selected.to, "yyyy-MM-dd"),
      recurrenceTasks: recurringDays.length >= 1 ? recurrentTasks : [],
    };
    console.log(newTask)
    createTask(newTask);
    resetField("title");
    resetField("description");
    setRecurringDaysArray([
      { name: "Lunes", isoDay: "1", status: false },
      { name: "Martes", isoDay: "2", status: false },
      { name: "Miercoles", isoDay: "3", status: false },
      { name: "Jueves", isoDay: "4", status: false },
      { name: "Viernes", isoDay: "5", status: false },
      { name: "Sabado", isoDay: "6", status: false },
      { name: "Domingo", isoDay: "0", status: false },
    ]);
    resetField("startTime");
    resetField("endTime");
    dialog.close();
    setStep(1);
  };

  const handleSteps = (e, step, data) => {
    e.preventDefault();
    if (step == 1 && data == "next") {
      setStep(2);
      setHeightModal(500);
    }

    if (step == 2 && data == "back") {
      setStep(1);
      setHeightModal(252);
    }

    if (step == 2 && data == "next") {
      setStep(3);
      setHeightModal(252);
    }

    if (step == 3 && data == "back") {
      setStep(2);
      setHeightModal(500);
    }
  };

  const [heightModal, setHeightModal] = useState(252);

  const [recurringDaysArray, setRecurringDaysArray] = useState([
    { name: "Lunes", isoDay: "1", status: false },
    { name: "Martes", isoDay: "2", status: false },
    { name: "Miercoles", isoDay: "3", status: false },
    { name: "Jueves", isoDay: "4", status: false },
    { name: "Viernes", isoDay: "5", status: false },
    { name: "Sabado", isoDay: "6", status: false },
    { name: "Domingo", isoDay: "0", status: false },
  ]);

  return (
    <form
      className={`grid grid-cols-[repeat(3,100%)] gap-6  transition-transform duration-500  ${
        step == 1 && "translate-x-[0]"
      } ${step == 2 && "translate-x-[calc(-100%-24px)]"} ${
        step == 3 && "translate-x-[calc(-200%-48px)]"
      } transition-height duration-500 ease-in-out ${
        step == 1 && "h-[230px]"
      } ${step == 2 && "min-h-[412px]"} ${step == 3 && "h-[218px]"} `}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <h3 className="text-xl mb-3 h-fit">Agregar Tarea</h3>
        <div className="grid gap-3">
          <div className="grid grid-rows-[16px,30px] gap-[6px] ">
            <label className="text-sm w-fit">Titulo</label>
            <InputTaskForm
              typeInput={"text"}
              placeholder={"Agregue un titulo"}
              name={"title"}
              required={true}
              register={register}
            />
          </div>
          <div className="grid gap-[6px]">
            <label className="text-sm">Descripcion</label>
            <TextAreaTaskForm
              rows={3}
              placeholder={"Agregue una descripcion"}
              name={"description"}
              register={register}
            />
          </div>
        </div>
        <div className="w-full flex justify-end mt-3">
          <NextButton
            disabled={titleText?.length > 0 ? false : true}
            onClick={(e) => handleSteps(e, step, "next")}
          />
        </div>
      </div>
      <div>
        <h3 className="text-xl h-fit">Fecha</h3>
        <DayPicker
          mode="range"
          selected={selected}
          onSelect={setSelected}
          disabled={{ before: new Date() }}
          footer={footer}
        />
        <div className="w-full flex justify-between mt-4 text-sm">
          <BackButton onClick={(e) => handleSteps(e, step, "back")} />
          <NextButton
            disabled={isDate(selected?.from) ? false : true}
            onClick={(e) => handleSteps(e, step, "next")}
          />
        </div>
      </div>
      <div>
        <h3 className="text-xl h-fit">Hora y Recurrencia</h3>
        <div className="flex my-6">
          <div className="grid gap-1 w-2/4 place-content-center">
            <label className="text-xs">Hora Inicio</label>
            <input
              type="time"
              {...register("startTime")}
              required
              className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-fit text-xs font-semibold"
            />
          </div>
          <div className="grid gap-1 w-2/4 place-content-center">
            <label className="text-xs">Hora Fin</label>
            <input
              type="time"
              {...register("endTime")}
              //Si la fecha inicio y de fin son iguales, no se puede elegir una hora menor a la de comienzo
              min={
                isSameDay(new Date(selected?.from), new Date(selected?.to))
                  ? startTime
                  : null
              }
              required
              className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-fit text-xs font-semibold"
            />
          </div>
        </div>
        <div className="grid gap-1 ">
          <label className="text-sm">Repetir todos los</label>
          <div className="flex gap-1 max-[425px]:max-w-[240px] justify-between justify-self-center">
            {recurringDaysArray.map((item) => (
              <ItemRecurrent
                register={register}
                handleCheck={handleCheckRecurringDays}
                status={item.status}
                day={item.name}
                isoDay={item.isoDay}
                key={item.isoDay}
                setRecurringDays={setRecurringDaysArray}
                recurringDays={recurringDaysArray}
                disabled={selected?.from == selected?.to}
              />
            ))}
          </div>
        </div>
        <div className="w-full flex justify-between mt-4 text-sm">
          <BackButton onClick={(e) => handleSteps(e, step, "back")} />
          <SaveButton />
        </div>
      </div>
    </form>
  );
}
