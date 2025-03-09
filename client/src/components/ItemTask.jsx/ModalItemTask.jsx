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
import { format, formatDate } from "date-fns";
import { es as esDateFns } from "date-fns/locale";
import InputItemTask from "./InputItemTask";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import { AcceptButton } from "../Buttons/ButtonsModal";
import TimeInput from "../Inputs/TimeInput";
import DropDownItemTask from "./DropDownItemTask";
import { useTasks } from "../../context/TasksContext";

export default function ModalItemTask({
  task,
  parentTask,
  modalIsActive,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [translateTab1Active, setTranslateTab1Active] = useState(false);
  const [tab1EditIs, setTab1EditIs] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState("");
  const { width } = useWindowSize();
  const [time, setTime] = useState({
    startTime: "00:00:00",
    endTime: "00:00:00",
  });
  const { updateTask, deleteTask } = useTasks();
  let tabs = [
    { id: 0, title: "Información", icon: <Info className="w-4 h-4" /> },
    { id: 1, title: "Tarea Padre", icon: <CalendarDays className="w-4 h-4" /> },
    { id: 2, title: "Estadísticas", icon: <BarChart3 className="w-4 h-4" /> },
  ];
  if (!task.isRecurring && !task.recurrenceOf) {
    tabs = [
      { id: 0, title: "Información", icon: <Info className="w-4 h-4" /> },
    ];
  }

  useEffect(() => {
    document.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && onClose()
    );
    return () => document.removeEventListener("keydown", onClose);
  }, []);

  useEffect(() => {
    if (!modalIsActive) setShowDeleteModal(false);
  }, [modalIsActive]);

  //Reducer
  const initialState = {
    title: task.title,
    description: task.description,
    taskDate: task.taskDate,
    startTime: task.startTime,
    endTime: task.endTime,
    status: task.status,
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
  const currentDate = new Date(`${task.taskDate}T00:00:00`);
  const [selectedSingle, setSelectedSingle] = useState([currentDate]);

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

  //Handlers
  const handleClose = () => {
    onClose();
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
    if (!task.recurrenceOf) {
      const updatedTask = {
        ...task, // Copia todas las propiedades de la tarea padre
        ...state,
      };
      updateTask(updatedTask);
    } else {
      const oldRecurrence = parentTask.recurrences.find(
        (recu) => recu._id == task._id
      );
      const newRecurrence = { ...oldRecurrence, ...state };
      const updatedRecurrences = parentTask.recurrences.map((recu) =>
        recu._id == task._id ? newRecurrence : recu
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
    if (!task.recurrenceOf) {
      const res = await deleteTask(task._id);
      if (res.status == 204) onClose();
      return;
    } else {
      //Si es una recurrencia eliminamos elemento de la tarea padre y actualizamos la tarea padre
      const updatedRecurrences = parentTask.recurrences.filter(
        (tasks) => tasks._id != task._id
      );

      const updatedTask = {
        ...parentTask, // Copia todas las propiedades de la tarea padre
        recurrences: updatedRecurrences, // Actualiza solo las recurrencias
      };

      const res = await updateTask(updatedTask, false, true);
      if (res.status == 200) onClose();
    }
  };

  return (
    <dialog
      id={`modal_task_${task._id}`}
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
                  className={`flex items-center px-4 py-3 border-b-2 transition-colors w-fit ${
                    activeTab === tab.id
                      ? "border-[#7E73FF] text-[#7E73FF]"
                      : "border-transparent text-gray-400 hover:text-gray-300"
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
                      status={task.status}
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
          {/* Tab 2: Tarea Padre */}
          {activeTab === 1 && task.recurrenceOf && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Título
                  </label>
                  <div className="p-3 bg-[#2A2B31] rounded-lg text-white">
                    {task.title}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Repetir
                  </label>
                  <div className="p-3 bg-[#2A2B31] rounded-lg text-white">
                    {task.recurringDays}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Fecha de Inicio
                    </label>
                    <div className="p-3 bg-[#2A2B31] rounded-lg text-white">
                      {task.taskDate}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Fecha de Fin
                    </label>
                    <div className="p-3 bg-[#2A2B31] rounded-lg text-white">
                      {task.recurringEndDate}
                    </div>
                  </div>
                </div>

                {/* <div className="bg-[#2A2B31] rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <button className="text-gray-400 hover:text-white">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <h3 className="text-lg font-medium">
                      {new Date(task.taskDate).toLocaleString("es-ES", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <button className="text-gray-400 hover:text-white">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-sm mb-2">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                      (day) => (
                        <div key={day} className="text-gray-400">
                          {day}
                        </div>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const currentDate = new Date(
                        new Date(task.taskDate).getFullYear(),
                        new Date(task.taskDate).getMonth(),
                        day
                      );
                      const recurrence = task.recurrences.find(
                        (r) =>
                          new Date(r.taskDate).toDateString() ===
                          currentDate.toDateString()
                      );
                      return (
                        <div
                          key={day}
                          className={`p-2 rounded-full ${
                            recurrence
                              ? "bg-[#7E73FF] text-white"
                              : "text-gray-400"
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div> */}
              </div>

              {/* Botones de acción para Tab 2 */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Todas las Recurrencias
                </button>
                <button
                  onClick={handleSaveButton}
                  className="px-4 py-2 bg-[#7E73FF] text-white rounded-md hover:bg-[#6A62D9] transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </button>
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
                {!task.isRecurring && !task.recurrenceOf
                  ? "¿Estás seguro de que quieres eliminar esta Tarea?"
                  : task.recurrenceOf
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
