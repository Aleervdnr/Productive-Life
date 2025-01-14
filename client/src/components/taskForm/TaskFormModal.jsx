import React, { useEffect, useState, useReducer } from "react";
import { RxCross1 } from "react-icons/rx";
import { useUi } from "../../context/UiContext";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { es} from "react-day-picker/locale";
import { format } from "date-fns";
import { AcceptButton } from "./ButtonsTaskForm";
import TimeInput from "./TimeInput";
import { useTasks } from "../../context/TasksContext";
import ItemRecurringDays from "../ItemRecurringDays";

export default function TaskFormModal() {
  //Contexts
  const {
    taskFormActive,
    setOverlayActive,
    setTaskFormActive,
    overlayIsClicked,
  } = useUi();

  const { createTask } = useTasks();

  //consts
  const sizesCarousel = {
    size1: "166px",
    size2: "276px",
    size3: "auto",
  };

  const recurringDaysArray = [
    { name: "Lunes", isoDay: "1" },
    { name: "Martes", isoDay: "2" },
    { name: "Miercoles", isoDay: "3" },
    { name: "Jueves", isoDay: "4" },
    { name: "Viernes", isoDay: "5" },
    { name: "Sabado", isoDay: "6" },
    { name: "Domingo", isoDay: "0" },
  ];

  //Reducer
  const initialState = {
    step: 1,
    step3Is: "Fecha",
    sizeCarousel: "166px",
    task: {
      title: "",
      description: "",
      taskDate: "",
      startTime: "00:00:00",
      endTime: "00:00:00",
      isRecurring: false,
      recurringDays: [],
      recurringEndDate: "",
    },
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_STEP":
        return { ...state, step: action.payload };
      case "SET_STEP_3_IS":
        return { ...state, step3Is: action.payload };
      case "SET_CAROUSEL_SIZE":
        return {
          ...state,
          sizeCarousel: action.payload,
        };
      case "UPDATE_TASK":
        return { ...state, task: { ...state.task, ...action.payload } };
      case "RESET":
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  //React-Hook-Form
  const { handleSubmit } = useForm();

  //Handlers
  const handleCloseMenu = () => {
    setOverlayActive(false);
    setTaskFormActive(false);
    setTimeout(() => {
      dispatch({ type: "RESET" });
      setSelected();
      dispatch({ type: "SET_STEP", payload: 1 });
    }, 600);
  };

  const handleAcceptButton = (e) => {
    e.preventDefault();
    dispatch({ type: "SET_STEP", payload: 2 });
  };

  const onSubmit = () => {
    const { title, taskDate, startTime, endTime } = state.task;

    if (!title) return alert("El título es obligatorio");
    if (!taskDate) return alert("La fecha es obligatoria");
    if (!startTime) return alert("La hora de inicio es obligatoria");
    if (!endTime) return alert("La Hora de Fin es obligatoria");
    if (startTime >= endTime)
      return alert("La hora de inicio debe ser anterior a la de finalización");

    createTask(state.task);
    handleCloseMenu();
  };

  // Day Picker
  const pastMonth = new Date();

  const defaultSelectedSingle = pastMonth;

  const defaultSelectedRange = {
    from: pastMonth,
    to: pastMonth,
  };

  const [selected, setSelected] = useState();

  let footer = (
    <p className="text-xs md:text-sm text-center mt-2">
      Elige el día para la tarea.
    </p>
  );
  if (!state.task.isRecurring && selected) {
    footer = (
      <p className="text-xs md:text-sm text-center mt-2">
        Elegiste el{" "}
        <span className="text-violet-main font-medium">
          {format(selected, "yyyy-MM-dd")}{" "}
        </span>
      </p>
    );
  } else if (state.task.isRecurring && selected) {
    if (!selected.to) {
      footer = <p>Desde el{format(selected.from, "yyyy-MM-dd")}</p>;
    } else if (selected.to) {
      footer = (
        <p className="text-xs md:text-sm text-center mt-2">
          <span>Desde el </span>
          <span className="text-violet-main font-medium">
            {format(selected.from, "yyyy-MM-dd")}{" "}
          </span>
          <span>- Hasta el </span>
          <span className="text-violet-main font-medium">
            {format(selected.to, "yyyy-MM-dd")}
          </span>
        </p>
      );
    }
  }

  //Effects
  useEffect(() => {
    if (selected && !state.task.isRecurring) {
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          taskDate: format(selected, "yyyy-MM-dd"),
          recurringEndDate: format(selected, "yyyy-MM-dd"),
        },
      });
    }
    if (selected && state.task.isRecurring) {
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          taskDate: format(selected.from, "yyyy-MM-dd"),
          recurringEndDate: format(selected.to, "yyyy-MM-dd"),
        },
      });
    }
  }, [selected]);

  useEffect(() => {
    if (state.step == 1)
      dispatch({
        type: "SET_CAROUSEL_SIZE",
        payload: sizesCarousel.size1,
      });
    if (state.step == 2) {
      setTimeout(() => {
        dispatch({
          type: "SET_CAROUSEL_SIZE",
          payload: sizesCarousel.size2,
        });
      }, 100);
    }
    if (state.step == 3 && state.step3Is == "Fecha") {
      setTimeout(() => {
        state.task.isRecurring == false
          ? setSelected(defaultSelectedSingle)
          : setSelected(defaultSelectedRange);
        dispatch({
          type: "SET_CAROUSEL_SIZE",
          payload: sizesCarousel.size3,
        });
      }, 100);
    }
    if (state.step == 3 && state.step3Is == "Hora") {
      setTimeout(() => {
        dispatch({
          type: "SET_CAROUSEL_SIZE",
          payload: sizesCarousel.size3,
        });
      }, 100);
    }
  }, [state.step]);

  useEffect(() => {
    if (taskFormActive) handleCloseMenu();
  }, [overlayIsClicked]);

  useEffect(() => {
    document.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && handleCloseMenu()
    );
    return () => document.removeEventListener("keydown", handleCloseMenu);
  }, []);

  return (
    <div
      className={`absolute bottom-0 left-1/2 -translate-x-1/2  w-dvw max-w-[550px] h-auto min-h-0  bg-dark-500 rounded-t-3xl z-[1001] grid grid-rows-[36px,1fr,70px] grid-cols-1 justify-items-center items-center ${
        taskFormActive ? "translate-y-0" : "translate-y-[100%]"
      } transition-transform duration-500 overflow-hidden`}
    >
      <div className="w-full h-5 flex justify-center items-center">
        <div className="w-[10%] h-1 bg-dark-200 rounded "></div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`grid grid-cols-[repeat(3,minmax(100%,500px))] w-full ${
          state.step == 1 && "translate-x-[0px]"
        } ${state.step == 2 && "translate-x-[-100%]"} ${
          state.step == 3 && "translate-x-[-200%]"
        } justify-self-start transition-all duration-500`}
        style={{ height: `${state.sizeCarousel}` }}
      >
        <div
          className={`grid gap-[10px] px-5`}
          style={{ maxHeight: `${sizesCarousel.size1}` }}
        >
          <TaskFormModalSelectType
            title={"Crear Tarea Unica"}
            description={"Se ejecuta una sola vez, sin repetición."}
            handleClick={() => {
              dispatch({ type: "SET_STEP", payload: 2 });
              dispatch({
                type: "UPDATE_TASK",
                payload: { isRecurring: false },
              });
            }}
          />
          <TaskFormModalSelectType
            title={"Crear Tarea Recurrente"}
            description={"Tiene un inicio, fin y se repite según un patrón."}
            handleClick={() => {
              dispatch({ type: "SET_STEP", payload: 2 });
              dispatch({ type: "UPDATE_TASK", payload: { isRecurring: true } });
            }}
          />
        </div>
        <div
          className={`h-full w-full px-5 flex flex-col gap-[10px]`}
          style={{ maxHeight: `${sizesCarousel.size2}` }}
        >
          <TaskFormModalInput
            placeholder={"Titulo"}
            value={state.task.title}
            onChange={(value) =>
              dispatch({ type: "UPDATE_TASK", payload: { title: value } })
            }
            required={true}
          />
          <TaskFormModalInput
            placeholder={"Descripción"}
            value={state.task.description}
            onChange={(value) =>
              dispatch({ type: "UPDATE_TASK", payload: { description: value } })
            }
          />
          <TaskFormModalSelectTime
            title={"Fecha"}
            placeholder={
              !selected
                ? "Elegir Fecha"
                : state.task.isRecurring
                ? `${format(selected.from, "yyyy-MM-dd")} a ${format(
                    selected.to,
                    "yyyy-MM-dd"
                  )}`
                : format(selected, "yyyy-MM-dd")
            }
            handleClick={() => {
              dispatch({ type: "SET_STEP", payload: 3 });
              dispatch({ type: "SET_STEP_3_IS", payload: "Fecha" });
            }}
          />
          <TaskFormModalSelectTime
            title={"Hora"}
            placeholder={
              state.task.startTime != "00:00:00" &&
              state.task.endTime != "00:00:00"
                ? `${state.task.startTime
                    .split(":")
                    .slice(0, 2)
                    .join(":")} - ${state.task.endTime
                    .split(":")
                    .slice(0, 2)
                    .join(":")}`
                : "Elegir Hora"
            }
            handleClick={() => {
              dispatch({ type: "SET_STEP", payload: 3 });
              dispatch({ type: "SET_STEP_3_IS", payload: "Hora" });
            }}
          />
          <button className="py-3 text-sm font-medium  w-full bg-violet-main rounded disabled:bg-dark-200 disabled:text-dark-100">
            Crear Tarea
          </button>
        </div>
        <div className="h-full w-full px-5 grid gap-4">
          {state.step3Is == "Fecha" ? (
            <>
              <DayPicker
                mode={state.task.isRecurring == false ? "single" : "range"}
                selected={selected}
                onSelect={setSelected}
                disabled={{ before: new Date() }}
                footer={footer}
                locale={es}
              />
              <div
                className={`grid gap-1 ${
                  state.task.isRecurring == false ? "hidden" : ""
                }`}
              >
                <label className="text-sm">Repetir todos los</label>
                <div className="flex gap-1 max-[425px]:max-w-[385px]">
                  {recurringDaysArray.map((item) => (
                    <ItemRecurringDays
                      key={item.isoDay}
                      name={item.name}
                      isoDay={item.isoDay}
                      isActive={state.task.recurringDays.includes(item.isoDay)}
                      handleToggle={(value) => {
                        const currentDays = state.task.recurringDays;
                        const updatedDays = currentDays.includes(value)
                          ? currentDays.filter((day) => day !== value)
                          : [...currentDays, value];
                        dispatch({
                          type: "UPDATE_TASK",
                          payload: { recurringDays: updatedDays },
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <TimeInput
                onChange={(value) =>
                  dispatch({
                    type: "UPDATE_TASK",
                    payload: { startTime: value },
                  })
                }
                title={"Desde Las"}
              />
              <TimeInput
                onChange={(value) =>
                  dispatch({
                    type: "UPDATE_TASK",
                    payload: { endTime: value },
                  })
                }
                title={"Hasta Las"}
              />
            </>
          )}
          <AcceptButton onClick={handleAcceptButton} />
        </div>
      </form>
      <button
        className="w-12 h-12 bg-dark-400 rounded-full grid place-content-center"
        onClick={handleCloseMenu}
      >
        <RxCross1 />
      </button>
    </div>
  );
}

const TaskFormModalSelectType = ({ title, description, handleClick }) => {
  const handleNextStep = (e) => {
    e.preventDefault();
    handleClick();
  };

  return (
    <button
      className="w-full max-h-[88px] bg-dark-400 rounded-lg px-5 py-[10px] text-left grid gap-1"
      onClick={handleNextStep}
    >
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-dark-100">{description}</p>
    </button>
  );
};

const TaskFormModalSelectTime = ({ title, placeholder, handleClick }) => {
  const handleNextStep = (e) => {
    e.preventDefault();
    handleClick();
  };

  return (
    <button
      className="w-full max-h-[88px] bg-dark-400 rounded-lg px-5 py-3 text-left flex justify-between items-center gap-1"
      onClick={handleNextStep}
    >
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-dark-100">{placeholder}</p>
    </button>
  );
};

const TaskFormModalInput = ({ placeholder, onChange, value, required }) => {
  return (
    <input
      type="text"
      className="w-full bg-dark-400 rounded-lg px-5 py-3 focus:outline-none placeholder:text-white placeholder:font-semibold"
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  );
};
