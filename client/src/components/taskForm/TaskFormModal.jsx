import React, { useEffect, useState, useReducer } from "react";
import { RxCross1 } from "react-icons/rx";
import { useUi } from "../../context/UiContext";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import {
  addDays,
  differenceInMilliseconds,
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  lastDayOfMonth,
  isValid,
} from "date-fns";
import { es as esDateFns } from "date-fns/locale";
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
    step3Is: "",
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
      setSelectedSingle(defaultSelectedSingle);
      setSelectedMultiple(defaultSelectedMultiple);
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

  const getSpecificDaysInRange = (start, end, targetDay) => {
    const allDaysInRange = eachDayOfInterval({ start, end });
    return allDaysInRange.filter((day) => getDay(day) === targetDay);
  };

  // Day Picker
  const pastMonth = new Date();

  const defaultSelectedSingle = pastMonth;

  const defaultSelectedMultiple = [new Date(), addDays(new Date(), 7)];

  const [selectedSingle, setSelectedSingle] = useState([pastMonth]);
  const [selectedMultiple, setSelectedMultiple] = useState(
    defaultSelectedMultiple
  );

  const handleSelected = (value) => {
    //Si se agregan dias
    if (value.length > selectedMultiple.length) {
      // Determinar las fechas mínima y máxima en el array
      const minDate = value.reduce(
        (min, date) => (isBefore(date, min) ? date : min),
        value[0]
      );
      const maxDate = value.reduce(
        (max, date) => (isAfter(date, max) ? date : max),
        value[0]
      );

      // Filtrar las fechas dentro del rango (excluyendo duplicados y ordenando)
      const filteredDates = Array.from(
        new Set( // Eliminar duplicados usando un Set
          value
            .filter(
              (date) => isWithinInterval(date, { start: minDate, end: maxDate }) // Incluir solo fechas dentro del rango
            )
            .sort((a, b) => differenceInMilliseconds(a, b)) // Ordenar de menor a mayor
        )
      );

      // Recalcular los días de recurrencia si hay días seleccionados en recurringDays
      const updatedDatesWithRecurrence = addRecurringDays(
        filteredDates,
        minDate,
        maxDate
      );

      // Actualizar el estado con las fechas filtradas y recalculadas
      setSelectedMultiple(updatedDatesWithRecurrence);
    } else {
      //Si se quitan dias
      const newArray = [];
      const minDate = value.reduce(
        (min, date) => (isBefore(date, min) ? date : min),
        value[0]
      );
      const maxDate = value.reduce(
        (max, date) => (isAfter(date, max) ? date : max),
        value[0]
      );

      // Filtrar las fechas dentro del rango (excluyendo minDate y maxDate)
      const filteredDates = Array.from(
        new Set( // Eliminar duplicados usando un Set
          value
            .filter(
              (date) =>
                !isSameDay(date, minDate) && // Excluir minDate
                !isSameDay(date, maxDate) && // Excluir maxDate
                isWithinInterval(date, { start: minDate, end: maxDate }) // Incluir solo fechas dentro del rango
            )
            .sort((a, b) => differenceInMilliseconds(a, b)) // Ordenar de menor a mayor
        )
      );

      newArray.push(minDate, ...filteredDates, maxDate);

      // Actualizar el estado con las fechas filtradas
      console.log(newArray);
      setSelectedMultiple(newArray);
    }
  };

  // Función para agregar días de recurrencia dentro del rango
  const addRecurringDays = (dates, startDate, endDate) => {
    const recurringDays = state.task.recurringDays; // Días de recurrencia seleccionados (e.g., ["1", "2", "3"])

    // Si no hay días de recurrencia seleccionados, devolver las fechas actuales
    if (!recurringDays || recurringDays.length === 0) {
      return dates;
    }

    // Calcular todos los días de recurrencia dentro del rango
    const allRecurringDays = recurringDays.flatMap((day) => {
      const targetDay = parseInt(day); // Convertir a número
      return getSpecificDaysInRange(startDate, endDate, targetDay);
    });

    // Combinar las fechas actuales con los días de recurrencia, eliminar duplicados y ordenar
    const combinedDates = Array.from(
      new Set([
        ...dates,
        ...allRecurringDays.filter(
          (day) =>
            !dates.some((existingDay) => isSameDay(existingDay, day)) && // Evitar duplicados
            !isSameDay(day, startDate) && // Excluir la fecha de inicio
            !isSameDay(day, endDate) // Excluir la fecha de fin
        ),
      ])
    ).sort((a, b) => differenceInMilliseconds(a, b)); // Ordenar de menor a mayor

    return combinedDates;
  };

  const modifiers = {
    first: selectedMultiple[0],
    last: selectedMultiple[selectedMultiple.length - 1],
    selected: selectedMultiple,
  };

  const modifiersClassNames = {
    first: "first-day",
    last: "end-day",
    between: "between-class",
  };

  let footer = (
    <p className="text-xs md:text-sm text-center mt-2">
      Elige el día para la tarea.
    </p>
  );
   if (!state.task.isRecurring && selectedSingle) {
     footer = (
       <p className="text-xs md:text-sm text-center mt-2">
         Elegiste el{" "}
         <span className="text-violet-main font-medium">
           {format(selectedSingle, "yyyy-MM-dd")}{" "}
         </span>
       </p>
     );
   } //else if (state.task.isRecurring && selectedMultiple) {
  //   if (!selectedMultiple.to) {
  //     //footer = <p>Desde el{format(selected.from, "yyyy-MM-dd")}</p>;
  //   } else if (selectedMultiple.to) {
  //     footer = (
  //       <p className="text-xs md:text-sm text-center mt-2">
  //         <span>Desde el </span>
  //         <span className="text-violet-main font-medium">
  //           {format(selectedMultiple.from, "yyyy-MM-dd")}{" "}
  //         </span>
  //         <span>- Hasta el </span>
  //         <span className="text-violet-main font-medium">
  //           {format(selectedMultiple.to, "yyyy-MM-dd")}
  //         </span>
  //       </p>
  //     );
  //   }
  // }

  //TimeInput
  const [time, setTime] = useState({
    startTime: "00:00:00",
    endTime: "00:00:00",
  });

  useEffect(() => {
    dispatch({
      type: "UPDATE_TASK",
      payload: { startTime: time.startTime, endTime: time.endTime },
    });
  }, [time]);

  //Effects
  useEffect(() => {
    if (selectedSingle && !state.task.isRecurring) {
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          taskDate: format(selectedSingle, "yyyy-MM-dd"),
          recurringEndDate: format(selectedSingle, "yyyy-MM-dd"),
        },
      });
    }
  }, [selectedSingle]);

  useEffect(() => {
    // Validar que selectedMultiple tenga al menos una fecha válida
    if (!Array.isArray(selectedMultiple) || selectedMultiple.length === 0) {
      console.error("selectedMultiple está vacío o no es un array");
      return;
    }

    // Validar que todos los elementos en selectedMultiple sean fechas válidas
    const areAllDatesValid = selectedMultiple.every((date) =>
      isValid(new Date(date))
    );
    if (!areAllDatesValid) {
      console.error("selectedMultiple contiene valores no válidos");
      return;
    }

    // Mapear las recurrencias
    const recurrences = selectedMultiple.map((date) => {
      const recurrence = {
        taskDate: format(new Date(date), "yyyy-MM-dd"),
        description: "",
        startTime: time.startTime,
        endTime: time.endTime,
      };
      return recurrence;
    });

    // Actualizar el estado
    dispatch({
      type: "UPDATE_TASK",
      payload: {
        taskDate: format(new Date(selectedMultiple[0]), "yyyy-MM-dd"), // Fecha de inicio
        recurringEndDate: format(
          new Date(selectedMultiple[selectedMultiple.length - 1]),
          "yyyy-MM-dd"
        ), // Fecha de fin
        recurrences,
      },
    });
  }, [selectedMultiple, time]);

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
    if (
      state.step == 3 &&
      state.step3Is == "Fecha" &&
      state.task.taskDate == ""
    ) {
      setTimeout(() => {
        state.task.isRecurring == false
          ? setSelectedSingle(defaultSelectedSingle)
          : setSelectedMultiple(defaultSelectedMultiple);
        dispatch({
          type: "SET_CAROUSEL_SIZE",
          payload: sizesCarousel.size3,
        });
      }, 100);
    }
    if (
      state.step == 3 &&
      state.step3Is == "Fecha" &&
      state.task.taskDate != ""
    ) {
      setTimeout(() => {
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
      className={`absolute bottom-0 left-1/2 -translate-x-1/2  w-dvw max-w-[550px] lg:max-w-[650px] h-auto min-h-0  bg-dark-500 rounded-t-3xl z-[1001] grid grid-rows-[36px,1fr,70px] grid-cols-1 justify-items-center items-center ${
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
          className={`grid gap-[10px] px-5 lg:px-10`}
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
          className={`h-full w-full px-5 lg:px-10 flex flex-col gap-[10px]`}
          style={{ maxHeight: `${sizesCarousel.size2}` }}
        >
          <TaskFormModalInput
            placeholder={"Titulo"}
            value={state.task.title}
            onChange={(value) =>
              dispatch({ type: "UPDATE_TASK", payload: { title: value } })
            }
            required={true}
            tabIndexValue={state.step == 2 ? 1 : -1}
          />
          <TaskFormModalInput
            placeholder={"Descripción"}
            value={state.task.description}
            onChange={(value) =>
              dispatch({ type: "UPDATE_TASK", payload: { description: value } })
            }
            tabIndexValue={state.step == 2 ? 2 : -1}
          />
          <TaskFormModalSelectTime
            title={"Fecha"}
            //placeholder={"Elegir Fecha"}
            placeholder={
              !selectedSingle || !selectedMultiple
                ? "Elegir Fecha"
                : state.task.isRecurring
                ? `Del ${format(selectedMultiple[0], "d 'de' MMMM", {
                    locale: esDateFns,
                  })} al ${format(selectedMultiple[selectedMultiple.length - 1], "d 'de' MMMM", {
                    locale: esDateFns,
                  })}`
                : format(selectedSingle, "d 'de' MMMM", {
                    locale: esDateFns,
                  })
            }
            handleClick={() => {
              dispatch({ type: "SET_STEP", payload: 3 });
              dispatch({ type: "SET_STEP_3_IS", payload: "Fecha" });
            }}
            tabIndexValue={state.step == 2 ? 3 : -1}
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
            tabIndexValue={state.step == 2 ? 4 : -1}
          />
          <button
            className="py-3 text-sm font-medium  w-full bg-violet-main rounded disabled:bg-dark-200 disabled:text-dark-100"
            tabIndex={state.step == 2 ? 5 : -1}
          >
            Crear Tarea
          </button>
        </div>
        <div className="h-full w-full px-5 lg:px-10  grid gap-4">
          {state.step3Is == "Fecha" && !state.task.isRecurring && (
            <>
              <DayPicker
                mode={"single"}
                selected={selectedSingle}
                onSelect={setSelectedSingle}
                disabled={{ before: new Date() }}
                footer={footer}
                locale={es}
              />
              <AcceptButton onClick={handleAcceptButton} />
            </>
          )}
          {state.step3Is == "Fecha" && state.task.isRecurring && (
            <>
              <DayPicker
                mode={"multiple"}
                selected={selectedMultiple}
                onSelect={handleSelected}
                disabled={{ before: new Date("2/1/2025") }}
                footer={<p>Selecciona una fecha</p>}
                locale={es}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
              />
              <div className="grid gap-1 justify-items-center">
                <label className="font-semibold">Repetir todos los</label>
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

                        if (!currentDays.includes(value)) {
                          // Si se activa un día de recurrencia
                          if (selectedMultiple.length >= 2) {
                            const startDate = selectedMultiple[0];
                            const endDate =
                              selectedMultiple[selectedMultiple.length - 1];
                            const targetDay = parseInt(value);
                            const specificDays = getSpecificDaysInRange(
                              startDate,
                              endDate,
                              targetDay
                            );

                            // Agregar los días calculados, excluyendo las fechas de inicio y fin
                            setSelectedMultiple((prev) => {
                              const newDates = [
                                ...prev,
                                ...specificDays.filter(
                                  (day) =>
                                    !prev.some((existingDay) =>
                                      isSameDay(existingDay, day)
                                    ) &&
                                    !isSameDay(day, startDate) &&
                                    !isSameDay(day, endDate)
                                ),
                              ];

                              // Ordenar las fechas en orden ascendente
                              return newDates.sort((a, b) =>
                                differenceInMilliseconds(a, b)
                              );
                            });
                          }
                        } else {
                          // Si se desactiva un día de recurrencia
                          if (selectedMultiple.length >= 2) {
                            const startDate = selectedMultiple[0];
                            const endDate =
                              selectedMultiple[selectedMultiple.length - 1];
                            const targetDay = parseInt(value);
                            const specificDays = getSpecificDaysInRange(
                              startDate,
                              endDate,
                              targetDay
                            );

                            // Eliminar los días calculados, pero mantener las fechas de inicio y fin
                            setSelectedMultiple((prev) => {
                              const newDates = prev.filter(
                                (day) =>
                                  !specificDays.some((specificDay) =>
                                    isSameDay(specificDay, day)
                                  ) ||
                                  isSameDay(day, startDate) ||
                                  isSameDay(day, endDate)
                              );

                              // Ordenar las fechas en orden ascendente
                              return newDates.sort((a, b) =>
                                differenceInMilliseconds(a, b)
                              );
                            });
                          }
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
              <AcceptButton onClick={handleAcceptButton} />
            </>
          )}
          {state.step3Is == "Hora" && (
            <>
              <TimeInput
                onChange={(value) =>
                  setTime({ startTime: value, endTime: time.endTime })
                }
                title={"Desde Las"}
              />
              <TimeInput
                onChange={(value) =>
                  setTime({ startTime: time.startTime, endTime: value })
                }
                title={"Hasta Las"}
              />
              <AcceptButton onClick={handleAcceptButton} />
            </>
          )}
        </div>
      </form>
      <button
        className="w-12 h-12 bg-dark-400 rounded-full grid place-content-center"
        onClick={handleCloseMenu}
        tabIndex={0}
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

const TaskFormModalSelectTime = ({
  title,
  placeholder,
  handleClick,
  tabIndexValue,
}) => {
  const handleNextStep = (e) => {
    e.preventDefault();
    handleClick();
  };

  return (
    <button
      className="w-full max-h-[88px] bg-dark-400 rounded-lg px-5 py-3 text-left flex justify-between items-center gap-1"
      onClick={handleNextStep}
      tabIndex={tabIndexValue}
    >
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-dark-100">{placeholder}</p>
    </button>
  );
};

const TaskFormModalInput = ({
  placeholder,
  onChange,
  value,
  required,
  tabIndexValue,
}) => {
  return (
    <input
      type="text"
      className="w-full bg-dark-400 rounded-lg px-5 py-3 focus:outline-none placeholder:text-white placeholder:font-semibold"
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      tabIndex={tabIndexValue}
    />
  );
};
