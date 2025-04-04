import React, { useEffect, useReducer, useState } from "react";
import { useUi } from "../../context/UiContext";
import {
  Info,
  Calendar,
  X,
  BarChart3,
  CalendarDays,
  Trash2,
  Save,
} from "lucide-react";
import useWindowSize from "../../hooks/useWindowSize";
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInMonths,
  differenceInWeeks,
  eachDayOfInterval,
  format,
  formatDate,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  subDays,
} from "date-fns";
import { es as esDateFns } from "date-fns/locale";
import InputItemTask from "./InputItemTask";
import { DayPicker } from "react-day-picker";
import { es, enUS as enUSDayPicker } from "react-day-picker/locale";
import { enUS } from "date-fns/locale";
import { AcceptButton } from "../Buttons/ButtonsModal";
import TimeInput from "../Inputs/TimeInput";
import DropDownItemTask from "./DropDownItemTask";
import { useTasks } from "../../context/TasksContext";
import ItemRecurringDays from "../ItemRecurringDays";
import { useTranslation } from "../../hooks/UseTranslation.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function ModalItemTask() {
  const [activeTab, setActiveTab] = useState(1);
  const [translateTab1Active, setTranslateTab1Active] = useState(false);
  const [tab1EditIs, setTab1EditIs] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { width } = useWindowSize();
  const { taskModalActive, setTaskModalActive } = useUi();
  const {
    tasks,
    setTasks,
    setCurrentTask,
    setParentTasks,
    parentTasks,
    updateTask,
    deleteTask,
    currentTask,
  } = useTasks();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [parentTask, setparentTask] = useState(
    parentTasks.find((tasks) => tasks._id == currentTask.recurrenceOf)
  );
  const [time, setTime] = useState({
    startTime: "00:00:00",
    endTime: "00:00:00",
  });
  let tabs = [
    {
      id: 1,
      title: t("tasks.modalTask.tabInformation"),
      icon: <Info className="w-4 h-4" />,
    },
    {
      id: 2,
      title: t("tasks.modalTask.tabRecurrences"),
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 3,
      title: t("tasks.modalTask.tabStats"),
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];
  if (!currentTask.isRecurring && !currentTask.recurrenceOf) {
    tabs = [
      { id: 1, title: "Información", icon: <Info className="w-4 h-4" /> },
    ];
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (taskModalActive) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [taskModalActive]);

  useEffect(() => {
    if (taskModalActive) {
      console.log(currentTask);
      document.getElementById(`modal_task_${currentTask._id}`).showModal();
    }
    if (!taskModalActive) {
      handleClose();
    }
  }, [taskModalActive]);

  const recurringDaysArray = [
    { name: t("tasks.days.monday"), isoDay: "1" },
    { name: t("tasks.days.tuesday"), isoDay: "2" },
    { name: t("tasks.days.wednesday"), isoDay: "3" },
    { name: t("tasks.days.thursday"), isoDay: "4" },
    { name: t("tasks.days.friday"), isoDay: "5" },
    { name: t("tasks.days.saturday"), isoDay: "6" },
    { name: t("tasks.days.sunday"), isoDay: "0" },
  ];

  //Reducer
  const initialState = {
    title: currentTask.title,
    description: currentTask.description,
    taskDate: currentTask.taskDate,
    startTime: currentTask.startTime,
    endTime: currentTask.endTime,
    status: currentTask.status,
    recurringDays: currentTask.recurringDays.map((iso) => iso.toString()),
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_TITLE":
        return {
          ...state,
          title: action.payload,
        };
      case "SET_DESCRIPTION":
        return {
          ...state,
          description: action.payload,
        };
      case "SET_TASKDATE":
        return {
          ...state,
          taskDate: action.payload,
        };
      case "SET_STARTTIME":
        return {
          ...state,
          startTime: action.payload,
        };
      case "SET_ENDTIME":
        return {
          ...state,
          endTime: action.payload,
        };
      case "SET_STATUS":
        return {
          ...state,
          status: action.payload,
        };
      case "UPDATE_TASK":
        return { ...state, ...action.payload };
      case "RESET":
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  //DayPicker
  const currentDate = new Date(`${currentTask.taskDate}T00:00:00`);
  let currentRecurrences = [];
  if (currentTask.recurrenceOf) {
    console.log(currentTask);
    console.log(parentTask);
    currentRecurrences = parentTask.recurrences.map(
      (recu) => new Date(`${recu.taskDate}T00:00:00`)
    );
  }

  const [selectedSingle, setSelectedSingle] = useState([currentDate]);
  const [selectedMultiple, setSelectedMultiple] = useState(currentRecurrences);

  const formatDate = (date, language) => {
    const locale = language === "es" ? es : enUS; // Selecciona el locale según el idioma
    const formatPattern =
      language === "es"
        ? "d 'de' MMMM" // Formato para español: "2 de abril"
        : "MMMM d"; // Formato para inglés: "April 2"

    return format(date, formatPattern, { locale });
  };

  let footer = (
    <p className="text-xs md:text-sm text-center mt-2">
      {t("tasks.dayPickerFooter.default")}
    </p>
  );
  if (selectedSingle) {
    footer = (
      <p className="text-xs md:text-sm text-center mt-2">
        {t("tasks.dayPickerFooter.selectedSingle")}{" "}
        <span className="text-violet-main font-medium">
          {formatDate(selectedSingle, language)}{" "}
        </span>
      </p>
    );
  }

  let footerRecurrences = (
    <p className="text-xs md:text-sm text-center mt-2">
      {t("tasks.dayPickerFooter.default")}
    </p>
  );

  if (currentTask.recurrenceOf) {
    footerRecurrences = (
      <p className="text-xs md:text-sm text-center mt-2">
        {t("tasks.dayPickerFooter.selectedMultipleFrom")}{" "}
        <span className="text-violet-main font-semibold">
          {formatDate(new Date(selectedMultiple[0]), language)}{" "}
        </span>
        {t("tasks.dayPickerFooter.selectedMultipleTo")}{" "}
        <span className="text-violet-main font-semibold">
          {formatDate(
            new Date(selectedMultiple[selectedMultiple.length - 1]),
            language
          )}
        </span>
      </p>
    );
  }

  const getSpecificDaysInRange = (start, end, targetDay) => {
    const allDaysInRange = eachDayOfInterval({ start, end });
    return allDaysInRange.filter((day) => getDay(day) === targetDay);
  };

  // Función para agregar días de recurrencia dentro del rango
  const addRecurringDays = (dates, startDate, endDate) => {
    const recurringDays = state.recurringDays; // Días de recurrencia seleccionados (e.g., ["1", "2", "3"])

    // Si no hay días de recurrencia seleccionados, devolver las fechas actuales
    if (!recurringDays || recurringDays.length === 0) {
      return dates;
    }

    // Calcular todos los días de recurrencia dentro del rango
    const allRecurringDays = recurringDays.flatMap((day) => {
      const targetDay = parseInt(day); // Convertir a número
      return getSpecificDaysInRange(startDate, endDate, targetDay);
    });
    console.log(allRecurringDays);

    // Combinar las fechas actuales con los días de recurrencia, eliminar duplicados y ordenar
    const combinedDates = Array.from(
      new Set([
        ...dates,
        ...allRecurringDays.filter(
          (day) =>
            (!dates.some((existingDay) => isSameDay(existingDay, day)) && // Evitar duplicados
              !isSameDay(day, startDate) && // Excluir la fecha de inicio
              !isSameDay(day, endDate) && // Excluir la fecha de fin
              isSameDay(day, new Date())) ||
            isAfter(day, new Date()) // Solo incluir días actuales o futuros
        ),
      ])
    ).sort((a, b) => differenceInMilliseconds(a, b)); // Ordenar de menor a mayor
    console.log(combinedDates);
    return combinedDates;
  };

  const modifiers = {
    first: selectedMultiple[0], // Primer día seleccionado
    last: selectedMultiple[selectedMultiple.length - 1], // Último día seleccionado
    between: (date) => {
      if (!selectedMultiple || selectedMultiple.length < 2) return false; // No hay rango válido
      const startDate = new Date(selectedMultiple[0]);
      const endDate = new Date(selectedMultiple[selectedMultiple.length - 1]);
      return date > startDate && date < endDate; // Días entre el primero y el último
    },
    selected: selectedMultiple,
  };

  const modifiersClassNames = {
    first: "first-day", // Clase para el primer día
    last: "end-day", // Clase para el último día
    between: "between-days", // Clase para los días intermedios
    selected: "selected-days",
  };

  //Handlers
  const handleClose = () => {
    if (!taskModalActive) return;
    const modal = document.getElementById(`modal_task_${currentTask._id}`);
    if (modal) {
      modal.close();
      setTaskModalActive(false);
      setCurrentTask(null);
      setShowDeleteModal(false);
      setTranslateTab1Active(false);
      setTab1EditIs("");
      dispatch({ type: "RESET" });
      setSelectedSingle([currentDate]);
    }
  };

  const handleEditDateTime = (value) => {
    setTranslateTab1Active(true);
    setTab1EditIs(value);
  };

  const handleAcceptButton = () => {
    setTranslateTab1Active(false);
    setTab1EditIs("");
  };

  const handleSelectedDate = (value) => {
    setSelectedSingle(value);
    dispatch({ type: "SET_TASKDATE", payload: format(value, "yyyy-MM-dd") });
  };

  const handleStatusChange = (newStatus) => {
    dispatch({ type: "SET_STATUS", payload: newStatus });
  };

  const handleSaveButton = () => {
    if (!currentTask.recurrenceOf) {
      const updatedTask = {
        ...currentTask, // Copia todas las propiedades de la tarea padre
        ...state,
      };
      updateTask(updatedTask);
    } else {
      const oldRecurrence = parentTask.recurrences.find(
        (recu) => recu._id == currentTask._id
      );
      const newRecurrence = { ...oldRecurrence, ...state };
      const updatedRecurrences = parentTask.recurrences.map((recu) =>
        recu._id == currentTask._id ? newRecurrence : recu
      );

      const updatedTask = {
        ...parentTask, // Copia todas las propiedades de la tarea padre
        title: state.title,
        recurrences: updatedRecurrences,
      };
      updateTask(updatedTask);
    }
  };

  const handleDeleteButton = async () => {
    //Si no es una recurrencia elimnamos directo de la BD
    if (!currentTask.recurrenceOf) {
      const res = await deleteTask(currentTask._id);
      if (res.status == 204) handleClose();
      return;
    } else if (activeTab == 1) {
      //Si es una recurrencia eliminamos elemento de la tarea padre y actualizamos la tarea padre
      const updatedRecurrences = parentTask.recurrences.filter(
        (tasks) => tasks._id != currentTask._id
      );

      const updatedTask = {
        ...parentTask, // Copia todas las propiedades de la tarea padre
        recurrences: updatedRecurrences, // Actualiza solo las recurrencias
      };

      const res = await updateTask(updatedTask, false, true);
      if (res.status == 200) handleClose();
    } else if (activeTab == 2) {
      const res = await deleteTask(parentTask._id);
      if (res.status == 204) {
        handleClose();
        const newTasks = tasks.filter(
          (task) => !task.recurrenceOf || task.recurrenceOf != parentTask._id
        );
        setTasks(newTasks);
      }
      return;
    }
  };

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

      const maxDateOfState = selectedMultiple.reduce(
        (max, date) => (isAfter(date, max) ? date : max),
        value[0]
      );

      if (isAfter(maxDate, addDays(maxDateOfState, 1))) {
        // Filtrar las fechas dentro del rango (excluyendo duplicados y ordenando)
        const filteredDates = Array.from(
          new Set( // Eliminar duplicados usando un Set
            value
              .filter(
                (date) =>
                  isWithinInterval(date, { start: minDate, end: maxDate }) // Incluir solo fechas dentro del rango
              )
              .sort((a, b) => differenceInMilliseconds(a, b)) // Ordenar de menor a mayor
          )
        );

        // Recalcular los días de recurrencia si hay días seleccionados en recurringDays
        const updatedDatesWithRecurrence = addRecurringDays(
          filteredDates,
          addDays(maxDateOfState, 1),
          subDays(maxDate, 1)
        );

        const filtered = [...new Set(updatedDatesWithRecurrence)];
        console.log(filtered, value);

        // Actualizar el estado con las fechas filtradas y recalculadas
        setSelectedMultiple(updatedDatesWithRecurrence);
      } else {
        const orderedDates = value.sort((a, b) =>
          differenceInMilliseconds(a, b)
        );
        setSelectedMultiple(orderedDates);
      }
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

  const handleSaveRecurrencesButton = () => {
    const formatedRecurrences = selectedMultiple.map((date) =>
      format(date, "yyyy-MM-dd")
    );

    const existingRecurrences = parentTask.recurrences.filter((date) =>
      formatedRecurrences.includes(date.taskDate)
    );

    // Crear un mapa para acceder rápidamente a los objetos en existingRecurrences
    const existingRecurrencesMap = new Map(
      existingRecurrences.map((item) => [item.taskDate, item])
    );

    // Construir el nuevo array
    const updatedRecurrences = formatedRecurrences.map((date) =>
      existingRecurrencesMap.has(date)
        ? existingRecurrencesMap.get(date)
        : {
            taskDate: date,
            description: "",
            startTime: currentTask.startTime,
            endTime: currentTask.endTime,
          }
    );

    const updatedTask = {
      ...parentTask, // Copia todas las propiedades de la tarea padre
      recurringEndDate:
        updatedRecurrences[updatedRecurrences.length - 1].taskDate,
      recurringDays: state.recurringDays,
      recurrences: updatedRecurrences, // Actualiza solo las recurrencias
    };
    updateTask(updatedTask);
  };

  const handleClickOverlay = (e) => {
    if (e.target.id == `modal_task_${currentTask._id}`) {
      handleClose();
    }
  };

  const paddingContent = "px-4 py-4 lg:px-6";

  //Estadisticas
  const completed = tasks.filter(
    (recu) =>
      recu.recurrenceOf == currentTask.recurrenceOf &&
      recu.status == "completed"
  ).length;

  const pending = tasks.filter(
    (recu) =>
      recu.recurrenceOf == currentTask.recurrenceOf && recu.status == "pending"
  ).length;

  const overdue = tasks.filter(
    (recu) =>
      recu.recurrenceOf == currentTask.recurrenceOf && recu.status == "overdue"
  ).length;

  const total = tasks.filter(
    (recu) => recu.recurrenceOf == currentTask.recurrenceOf
  ).length;
  const totalRecurrences = tasks.filter(
    (recu) => recu.recurrenceOf == currentTask.recurrenceOf
  );
  const totalRecurrencesCompleted = tasks.filter(
    (recu) =>
      recu.recurrenceOf == currentTask.recurrenceOf &&
      recu.status === "completed"
  );

  const porcentajeCompleted = ((completed / total) * 100).toFixed(2);

  const getDifference = (dates) => {
    // Obtener la primera fecha y la última fecha
    const firstTaskDate = new Date(dates[0].taskDate); // Primera fecha
    const lastRecurringEndDate = new Date(dates[dates.length - 1].taskDate); // Última fecha

    // Calcular la diferencia total en días, semanas y meses
    const totalDaysDifference = differenceInDays(
      lastRecurringEndDate,
      firstTaskDate
    );
    const totalWeeksDifference = Math.floor(totalDaysDifference / 7); // Semanas completas
    const remainingDays = totalDaysDifference % 7; // Días restantes después de las semanas completas
    const totalMonthsDifference = differenceInMonths(
      lastRecurringEndDate,
      firstTaskDate
    );

    let formattedDifference;

    if (totalMonthsDifference > 0) {
      // Si hay al menos 1 mes de diferencia
      const remainingWeeks = differenceInWeeks(
        lastRecurringEndDate,
        addMonths(firstTaskDate, totalMonthsDifference)
      ); // Semanas restantes después de los meses completos

      if (remainingWeeks > 0) {
        formattedDifference = `${totalMonthsDifference} ${
          totalMonthsDifference > 1 ? t("tasks.timeUnits.months") : t("tasks.timeUnits.month")
        } ${t("tasks.modalTask.statistics.and")} ${remainingWeeks} ${remainingWeeks > 1 ? t("tasks.timeUnits.weeks") : t("tasks.timeUnits.week")}`;
      } else {
        formattedDifference = `${totalMonthsDifference} ${
          totalMonthsDifference > 1 ? t("tasks.timeUnits.months") : t("tasks.timeUnits.month")
        }`;
      }
    } else if (totalWeeksDifference > 0) {
      // Si hay al menos 1 semana de diferencia
      if (remainingDays > 0) {
        formattedDifference = `${totalWeeksDifference} ${
          totalWeeksDifference > 1 ? t("tasks.timeUnits.weeks") : t("tasks.timeUnits.week")
        } ${t("tasks.modalTask.statistics.and")} ${remainingDays} ${remainingDays > 1 ? t("tasks.timeUnits.days") : t("tasks.timeUnits.day")}`;
      } else {
        formattedDifference = `${totalWeeksDifference} ${
          totalWeeksDifference > 1 ? t("tasks.timeUnits.weeks") : t("tasks.timeUnits.week")
        }`;
      }
    } else {
      // Solo días de diferencia
      formattedDifference = `${totalDaysDifference} ${
        totalDaysDifference > 1 ? t("tasks.timeUnits.days") : t("tasks.timeUnits.day")
      }`;
    }

    return formattedDifference;
  };

  const formattedTotalDifference = getDifference(totalRecurrences);
  const formattedCompletedDifference =
    totalRecurrencesCompleted.length > 0
      ? getDifference(totalRecurrencesCompleted)
      : "0" + t("tasks.timeUnits.days");

  // Filtrar las tareas completadas
  const completedTasks = tasks?.filter(
    (task) =>
      task.status === "completed" &&
      task.recurrenceOf == currentTask.recurrenceOf
  );

  // Función para calcular el tiempo invertido en minutos
  const calculateTimeSpent = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    return differenceInMinutes(end, start);
  };

  // Calcular el tiempo total y el promedio
  let totalTimeSpent = 0;

  completedTasks.forEach((task) => {
    const timeSpent = calculateTimeSpent(task.startTime, task.endTime);
    totalTimeSpent += timeSpent;
  });

  const averageTime =
    completedTasks.length > 0 ? totalTimeSpent / completedTasks.length : 0;

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let timeFormatted = `${hours}h ${remainingMinutes}m`;

    if (hours == 0) {
      timeFormatted = `${remainingMinutes}m`;
    }
    if (remainingMinutes == 0) {
      timeFormatted = `${hours}h`;
    }
    return timeFormatted;
  };

  return (
    <dialog
      id={`modal_task_${currentTask._id}`}
      className={`fixed w-screen h-screen max-w-none max-h-none z-[999] m-0 overflow-hidden bg-[#0006] grid place-content-center opacity-0 modal-task invisible transition-opacity`}
      onClick={(e) => handleClickOverlay(e)}
    >
      <div
        className={`transition-opacity delay-300 bg-dark-500 rounded-md w-[calc(100vw-20px)] lg:w-fit h-fit
         `}
      >
        {/* Header con tabs y botón de cerrar */}
        <div className="border-b border-gray-700">
          <div className="flex items-center justify-between px-4">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center px-4 py-3 border-b-2 transition-colors w-fit focus:outline-none ${
                    activeTab === tab.id
                      ? "border-[#7E73FF] text-[#7E73FF]"
                      : "border-transparent text-gray-400 hover:text-gray-300 "
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}

                  <span
                    className={`${
                      width < 720 && activeTab !== tab.id ? "hidden" : ""
                    } ${activeTab == tab.id && "text-white"} pl-1 `}
                  >
                    {tab.title}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-300"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Contenido de los tabs */}
        <div className="overflow-hidden max-h-dvh max-w-[720px] ">
          {/* Tab 1: Información */}
          {activeTab === 1 && (
            <div
              className={`grid grid-cols-[100%,100%] justify-items-center transition-transform duration-500 ${
                translateTab1Active ? "translate-x-[-100%]" : ""
              } `}
            >
              <div className={`w-full space-y-4 ${paddingContent}`}>
                <div className="space-y-2">
                  <InputItemTask
                    label={t("tasks.modalTask.title")}
                    value={state.title}
                    onChange={(value) =>
                      dispatch({ type: "SET_TITLE", payload: value })
                    }
                  />
                  <div className="relative  p-3 pb-1 pt-5 bg-[#2A2B31]">
                    <label className="absolute top-1 text-violet-main block text-xs font-bold">
                      {t("tasks.modalTask.description")}
                    </label>
                    <textarea
                      value={state.description}
                      className="w-full bg-[#2A2B31] rounded-lg text-white focus:outline-none"
                      onChange={(e) =>
                        dispatch({
                          type: "SET_DESCRIPTION",
                          payload: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <DropDownItemTask
                      status={state.status}
                      onChange={handleStatusChange}
                    />
                    <div
                      className="relative max-sm:row-start-2 cursor-pointer"
                      onClick={() => handleEditDateTime("Date")}
                    >
                      <label className="absolute px-3 top-1 text-violet-main block text-xs font-bold">
                        {t("tasks.modalTask.date")}
                      </label>
                      <div className="p-3 pb-1 pt-5 bg-[#2A2B31] rounded-lg text-white focus:outline-none">
                        {format(`${state.taskDate}T00:00:00`, "d 'de' MMMM", {
                          locale: esDateFns,
                        })}
                      </div>
                    </div>
                    <div
                      className="relative max-sm:row-start-2 cursor-pointer"
                      onClick={() => handleEditDateTime("Time")}
                    >
                      <label className="absolute px-3 top-1 text-violet-main block text-xs font-bold">
                        {t("tasks.modalTask.time")}
                      </label>
                      <div className="p-3 pb-1 pt-5 bg-[#2A2B31] rounded-lg text-white focus:outline-none">
                        {state.startTime.slice(0, 5)} -{" "}
                        {state.endTime.slice(0, 5)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción para Tab 1 */}
                <div className="flex justify-end gap-4">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center text-sm font-medium"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("tasks.modalTask.deleteButton")}
                  </button>
                  <button
                    className="px-4 py-2 bg-violet-main text-white rounded-md hover:bg-[#6A62D9] transition-colors flex items-center text-sm font-medium"
                    onClick={handleSaveButton}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t("tasks.modalTask.saveButton")}
                  </button>
                </div>
              </div>
              <div className={`w-fit ${paddingContent}`}>
                {translateTab1Active && tab1EditIs == "Date" && (
                  <div className="max-w-[354px]">
                    <DayPicker
                      mode={"single"}
                      selected={selectedSingle}
                      onSelect={handleSelectedDate}
                      disabled={{ before: new Date() }}
                      footer={footer}
                      locale={language == "es" ? es : enUSDayPicker}
                    />
                    <AcceptButton onClick={handleAcceptButton} />
                  </div>
                )}
                {translateTab1Active && tab1EditIs == "Time" && (
                  <div className="grid gap-4">
                    <TimeInput
                      onChange={(value) =>
                        dispatch({ type: "SET_STARTTIME", payload: value })
                      }
                      title={t("tasks.timeInput.from")}
                      value={state.startTime}
                    />
                    <TimeInput
                      onChange={(value) =>
                        dispatch({ type: "SET_ENDTIME", payload: value })
                      }
                      title={t("tasks.timeInput.to")}
                      value={state.endTime}
                    />
                    <AcceptButton onClick={handleAcceptButton} />
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Tab 2: Recurrencias */}
          {activeTab === 2 && currentTask.recurrenceOf && (
            <div className={`space-y-4 ${paddingContent} `}>
              <div className="space-y-2">
                <DayPicker
                  mode={"multiple"}
                  selected={selectedMultiple}
                  onSelect={handleSelected}
                  disabled={{ before: new Date("2/1/2025") }}
                  footer={footerRecurrences}
                  locale={language == "es" ? es : enUSDayPicker}
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  numberOfMonths={width >= 1024 ? 2 : 1}
                />
                <div className="grid gap-1 justify-items-center">
                  <label className="font-semibold">
                    {t("tasks.modalTask.repeatTitle")}
                  </label>
                  <div className="flex gap-1 max-[425px]:max-w-[385px]">
                    {recurringDaysArray.map((item) => (
                      <ItemRecurringDays
                        key={item.isoDay}
                        name={item.name}
                        isoDay={item.isoDay}
                        isActive={state.recurringDays.includes(item.isoDay)}
                        handleToggle={(value) => {
                          const currentDays = state.recurringDays;
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
                                new Date(),
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
                                    isSameDay(day, endDate) ||
                                    isBefore(day, new Date())
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
                {/* <AcceptButton onClick={handleSaveRecurrencesButton} /> */}
                {/* Botones de acción para Tab 2 */}
                <div className="flex justify-end gap-4 mt-2">
                  <button
                    //onClick={() => handleDelete("single")}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center text-sm font-medium"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("tasks.modalTask.deleteAllButton")}
                  </button>
                  <button
                    //onClick={handleSave}
                    className="px-4 py-2 bg-violet-main text-white rounded-md hover:bg-[#6A62D9] transition-colors flex items-center text-sm font-medium"
                    onClick={handleSaveRecurrencesButton}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t("tasks.modalTask.saveButton")}
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 3 && currentTask.recurrenceOf && (
            <div className={`space-y-4 ${paddingContent} `}>
              <div className="flex justify-between text-violet-main font-semibold gap-3">
                <div className="bg-dark-400 px-4 py-1 w-full rounded-lg grid text-sm">
                  {t("tasks.modalTask.statistics.progress.label")}
                  <span className="text-white text-3xl">
                    {porcentajeCompleted}%
                  </span>
                  <span className="">{`${completed} ${t(
                    "tasks.modalTask.statistics.progress.of"
                  )} ${total} ${t(
                    "tasks.modalTask.statistics.progress.total"
                  )}`}</span>
                </div>
                <div className="bg-dark-400 px-4 py-1 w-full rounded-lg grid text-sm">
                  {t("tasks.modalTask.statistics.totalRecurrences.label")}
                  <span className="text-white text-3xl">{total}</span>
                  <span className="">
                    {t("tasks.modalTask.statistics.totalRecurrences.inPeriod")}
                    {` ${formattedTotalDifference}`}
                  </span>
                </div>
              </div>
              <div className="bg-dark-400 px-4 py-1 w-full rounded-lg grid text-sm">
                <span className="text-violet-main font-semibold">
                  {t("tasks.modalTask.statistics.recurrencesStatus.title")}
                </span>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                        <span className="">
                          {t(
                            "tasks.modalTask.statistics.recurrencesStatus.completed"
                          )}
                        </span>
                      </div>
                      <span>{completed}</span>
                    </div>
                    <progress
                      className="w-full h-2 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-zinc-800 
                [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[#22C55E]
                [&::-moz-progress-bar]:bg-[#22C55E]"
                      value={completed}
                      max={total}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#EAB308]"></div>
                        <span className="">
                          {t(
                            "tasks.modalTask.statistics.recurrencesStatus.pending"
                          )}
                        </span>
                      </div>
                      <span>{pending}</span>
                    </div>
                    <progress
                      className="w-full h-2 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-zinc-800 
                [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[#EAB308]
                [&::-moz-progress-bar]:bg-[#EAB308]"
                      value={pending}
                      max={total}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                        <span className="">
                          {t(
                            "tasks.modalTask.statistics.recurrencesStatus.overdue"
                          )}
                        </span>
                      </div>
                      <span>{overdue}</span>
                    </div>
                    <progress
                      className="w-full h-2 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-zinc-800 
                [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-[#EF4444]
                [&::-moz-progress-bar]:bg-[#EF4444]"
                      value={overdue}
                      max={total}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-violet-main font-semibold gap-3">
                <div className="bg-dark-400 px-4 py-1 w-full rounded-lg grid text-sm">
                  {t("tasks.modalTask.statistics.averageTime.label")}
                  <span className="text-white text-3xl">
                    {formatTime(Math.round(averageTime))}
                  </span>
                  <span className="">
                    {" "}
                    {t("tasks.modalTask.statistics.averageTime.perTask")}
                  </span>
                </div>
                <div className="bg-dark-400 px-4 py-1 w-full rounded-lg grid text-sm">
                  {t("tasks.modalTask.statistics.dedicatedHours.label")}
                  <span className="text-white text-3xl">
                    {formatTime(totalTimeSpent)}
                  </span>
                  <span className="">
                    {t("tasks.modalTask.statistics.dedicatedHours.inPeriod")}
                    {` ${formattedCompletedDifference}`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Modal de confirmación para eliminar */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-dark-500 p-6 rounded-lg max-w-sm w-full">
              <h3 className="text-xl font-bold mb-4">Confirmar Eliminación</h3>
              <p className="mb-6">
                {!currentTask.isRecurring && !currentTask.recurrenceOf
                  ? "¿Estás seguro de que quieres eliminar esta Tarea?"
                  : activeTab == 1
                  ? "¿Estás seguro de que quieres eliminar esta recurrencia?"
                  : "¿Estás seguro de que quieres eliminar todas las recurrencias?"}
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteButton}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
