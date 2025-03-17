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
  differenceInMilliseconds,
  eachDayOfInterval,
  format,
  formatDate,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { es as esDateFns } from "date-fns/locale";
import InputItemTask from "./InputItemTask";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import { AcceptButton } from "../Buttons/ButtonsModal";
import TimeInput from "../Inputs/TimeInput";
import DropDownItemTask from "./DropDownItemTask";
import { useTasks } from "../../context/TasksContext";
import ItemRecurringDays from "../ItemRecurringDays";

export default function ModalItemTask({
  parentTask = null,
  modalIsActive = false,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [translateTab1Active, setTranslateTab1Active] = useState(false);
  const [tab1EditIs, setTab1EditIs] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { width } = useWindowSize();
  const { setTaskModalActive } = useUi();
  const { setCurrentTask } = useTasks();
  const [time, setTime] = useState({
    startTime: "00:00:00",
    endTime: "00:00:00",
  });
  const { updateTask, deleteTask, currentTask } = useTasks();
  let tabs = [
    { id: 0, title: "Información", icon: <Info className="w-4 h-4" /> },
    {
      id: 1,
      title: "Recurrencias",
      icon: <CalendarDays className="w-4 h-4" />,
    },
    { id: 2, title: "Estadísticas", icon: <BarChart3 className="w-4 h-4" /> },
  ];
  if (!currentTask.isRecurring && !currentTask.recurrenceOf) {
    tabs = [
      { id: 0, title: "Información", icon: <Info className="w-4 h-4" /> },
    ];
  }

  useEffect(() => {
    document.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && handleClose()
    );
    console.log(currentTask);
    return () => document.removeEventListener("keydown", handleClose);
  }, []);

  useEffect(() => {
    if (modalIsActive) {
      console.log(currentTask);
      document.getElementById(`modal_task_${currentTask._id}`).showModal();
    }
    if (!modalIsActive) {
      handleClose();
    }
  }, [modalIsActive]);

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

  let footer = (
    <p className="text-xs md:text-sm text-center mt-2">
      Elige el día para la tarea.
    </p>
  );
  if (selectedSingle) {
    footer = (
      <p className="text-xs md:text-sm text-center mt-2">
        Elegiste el{" "}
        <span className="text-violet-main font-medium">
          {format(selectedSingle, "d 'de' MMMM", {
            locale: esDateFns,
          })}{" "}
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
    setTaskModalActive(false);
    setCurrentTask(null);
    document.getElementById(`modal_task_${currentTask._id}`).close();
    setShowDeleteModal(false);
    setTranslateTab1Active(false);
    setTab1EditIs("");
    dispatch({ type: "RESET" });
    setSelectedSingle([currentDate]);
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
    } else {
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

  const handleSaveRecurrencesButton = () => {
    const formatedRecurrences = selectedMultiple.map((date) =>
      format(date, "yyyy-MM-dd")
    );
    const existingRecurrences = parentTask.recurrences.map((date) => {
      if (formatedRecurrences.includes(date.taskDate)) return date.taskDate;
    });
    // Filtrar las fechas que NO están en `existingRecurrences`
    const updatedRecurrences = formatedRecurrences.filter(
      (date) => !existingRecurrences.includes(date)
    );

    console.log(updatedRecurrences);
  };

  return (
    <dialog
      id={`modal_task_${currentTask._id}`}
      className={`fixed w-screen h-screen max-w-none max-h-none z-[999] m-0 overflow-hidden bg-[#0006] grid place-content-center opacity-0 modal-task invisible transition-opacity`}
    >
      <div
        className={`transition-opacity delay-300 bg-dark-500 rounded-md w-[calc(100vw-20px)] max-w-[620px] h-fit
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
        <div className="overflow-hidden max-h-dvh ">
          {/* Tab 1: Información */}
          {activeTab === 0 && (
            <div
              className={`grid grid-cols-[100%,100%] justify-items-center transition-transform duration-500 ${
                translateTab1Active ? "translate-x-[-100%]" : ""
              } `}
            >
              <div className="w-full space-y-4 p-4">
                <div className="space-y-2">
                  <InputItemTask
                    label={"Título"}
                    value={state.title}
                    onChange={(value) =>
                      dispatch({ type: "SET_TITLE", payload: value })
                    }
                  />
                  <InputItemTask
                    label={"Descripción"}
                    value={state.description}
                    onChange={(value) =>
                      dispatch({ type: "SET_DESCRIPTION", payload: value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <DropDownItemTask
                      status={currentTask.status}
                      onChange={handleStatusChange}
                    />
                    <div
                      className="relative max-sm:row-start-2 cursor-pointer"
                      onClick={() => handleEditDateTime("Date")}
                    >
                      <label className="absolute px-3 top-1 text-violet-main block text-xs font-bold">
                        Fecha
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
                        Hora
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
                    //onClick={() => handleDelete("single")}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center text-sm font-medium"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </button>
                  <button
                    //onClick={handleSave}
                    className="px-4 py-2 bg-violet-main text-white rounded-md hover:bg-[#6A62D9] transition-colors flex items-center text-sm font-medium"
                    onClick={handleSaveButton}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </button>
                </div>
              </div>
              <div className="p-4">
                {translateTab1Active && tab1EditIs == "Date" && (
                  <div className="max-w-[354px]">
                    <DayPicker
                      mode={"single"}
                      selected={selectedSingle}
                      onSelect={handleSelectedDate}
                      disabled={{ before: new Date() }}
                      footer={footer}
                      locale={es}
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
                      title={"Desde Las"}
                      value={state.startTime}
                    />
                    <TimeInput
                      onChange={(value) =>
                        dispatch({ type: "SET_ENDTIME", payload: value })
                      }
                      title={"Hasta Las"}
                      value={state.endTime}
                    />
                    <AcceptButton onClick={handleAcceptButton} />
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Tab 2: Recurrencias */}
          {activeTab === 1 && currentTask.recurrenceOf && (
            <div className="space-y-4 p-4">
              <div className="space-y-2">
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
                <AcceptButton onClick={handleSaveRecurrencesButton} />
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
                  : currentTask.recurrenceOf
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
