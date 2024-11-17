import { FaCheck } from "react-icons/fa6";
import { useTasks } from "../../context/TasksContext";
import { useForm } from "react-hook-form";
import { useDate } from "../../context/DateContext.jsx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiPencilFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { format, getISODay, isBefore, isToday, parseISO } from "date-fns";
import { RiCalendar2Line } from "react-icons/ri";
import { RiCalendarCheckLine } from "react-icons/ri";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { RiTimeLine } from "react-icons/ri";
import ItemRecurrent from "../ItemRecurrent.jsx";
import generateOccurrences from "../../libs/generateOcurrences.js";

export default function ItemTodayTask({ task }) {
  const { title, startTime, endTime, status, _id } = task;
  const { tasks, updateTask, deleteTask, handleCheckRecurringDays } =
    useTasks();
  const { register, setValue, handleSubmit, watch } = useForm();
  const { nowDate, daysOfWeek } = useDate();
  const [editIsActive, setEditIsActive] = useState(false);

  const dialog = document.getElementById(`modal_day_${task._id}`);

  const [recurringDays, setRecurringDays] = useState([
    { name: "Lunes", isoDay: "1", status: task.recurringDays.includes(1) },
    { name: "Martes", isoDay: "2", status: task.recurringDays.includes(2) },
    { name: "Miercoles", isoDay: "3", status: task.recurringDays.includes(3) },
    { name: "Jueves", isoDay: "4", status: task.recurringDays.includes(4) },
    { name: "Viernes", isoDay: "5", status: task.recurringDays.includes(5) },
    { name: "Sabado", isoDay: "6", status: task.recurringDays.includes(6) },
    { name: "Domingo", isoDay: "0", status: task.recurringDays.includes(0) },
  ]);

  const parentTask = tasks.find((taskMap) => taskMap._id == task.recurrenceOf);

  const [recurrencesChange, setRecurrencesChange] = useState([]);
  const [recurrencesDelete, setRecurrencesDelete] = useState([]);

  const handleChangeStatus = () => {
    if (!task.recurrenceOf) {
      const newTask = task;
      if (status == "completed") newTask.status = "pending";
      if (status == "pending") newTask.status = "completed";

      updateTask(newTask, true);
    } else {
      const toggle = (task) => {
        if (status == "completed") {
          const newTask = {
            startTime: task.startTime,
            endTime: task.endTime,
            taskDate: task.taskDate,
            status: "pending",
            _id: task._id,
          };
          return newTask;
        }
        if (status == "pending") {
          const newTask = {
            startTime: task.startTime,
            endTime: task.endTime,
            taskDate: task.taskDate,
            status: "completed",
            _id: task._id,
          };
          return newTask;
        }
      };
      const modifiedRecurrences = parentTask.recurrences.map((taskMap) =>
        taskMap._id == task._id ? toggle(taskMap) : taskMap
      );

      parentTask.recurrences = modifiedRecurrences;
      updateTask(parentTask, true);
    }
  };

  const taskDate = watch("taskDate");
  const endTaskDate = watch("recurringEndDate");

  const handleShowModal = (e) => {
    if (
      e.target.id == `status_${task._id}` ||
      e.target.id == `status_icon_${task._id}`
    ) {
      e.preventDefault();
    } else {
      document.getElementById(`modal_day_${task._id}`).showModal();
      setValue("title", task.title);
      setValue("description", task.description);
      setValue("taskDate", task.taskDate);
      setValue("recurringEndDate", task.recurringEndDate);
      setValue("startTime", task.startTime);
      setValue("endTime", task.endTime);
    }
  };

  const onSubmit = (data) => {
    const {
      title,
      description,
      taskDate,
      recurringEndDate,
      startTime,
      endTime,
    } = data;

    const filteredRecurringDays = recurringDays
      .filter((item) => item.status == true)
      .map((item) => item.status == true && item.isoDay);

    const forRecurrences = {
      taskDate,
      recurringEndDate,
      startTime,
      endTime,
      recurringDays: filteredRecurringDays,
    };

    const updatedTask = {
      _id: task._id,
      title,
      description,
      taskDate,
      recurringEndDate,
      startTime: startTime.length == 8 ? startTime : `${startTime}:00`,
      endTime: endTime.length == 8 ? endTime : `${endTime}:00`,
      recurringDays: filteredRecurringDays ? filteredRecurringDays : [],
      isRecurring: filteredRecurringDays.length >= 1 && true,
      recurrences: generateOccurrences(forRecurrences),
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      user: task.user,
    };
    updateTask(updatedTask, false);
    dialog.close();
    setEditIsActive(false);
  };

  const onSubmitRecurrence = (data) => {
    //Desestructuramos el objeto a recibir
    const {
      title,
      description,
      taskDate,
      startTime,
      endTime,
      recurringEndDate,
    } = data;
    console.log(data, task);

    //Obtenemos la tarea padre
    const parentTask = tasks.find(
      (taskMap) => taskMap._id == task.recurrenceOf
    );

    //Con la data recibida armamos un nueva recurrencia
    const newRecurrence = {
      taskDate,
      description,
      startTime: startTime.length == 8 ? startTime : `${startTime}:00`,
      endTime: endTime.length == 8 ? endTime : `${endTime}:00`,
      status: task.status,
      _id: task._id,
    };

    console.log(newRecurrence);

    //Si no hay que agregar ni eliminar recurrencias, solo edicion de info
    if (recurrencesChange.length == 0 && recurrencesDelete.length == 0) {
      //Luego modificamos mediante el id en el lugar de la tarea a actuazaliar colocamos la recurrencia nueva
      const recurrences = parentTask.recurrences.map((taskMap) =>
        taskMap._id == task._id ? newRecurrence : taskMap
      );

      const newTask = {
        _id: parentTask._id,
        title: title,
        description: parentTask.description,
        taskDate: parentTask.taskDate,
        recurringEndDate: parentTask.recurringEndDate,
        startTime: parentTask.startTime,
        endTime: parentTask.endTime,
        recurringDays: parentTask.recurringDays,
        isRecurring: parentTask.isRecurring,
        recurrences: recurrences,
        status: parentTask.status,
        createdAt: parentTask.createdAt,
        updatedAt: parentTask.updatedAt,
        user: parentTask.user,
      };
      console.log(newTask);
      updateTask(newTask, false);
    }

    //Si hay que eliminar recurrencias
    if (recurrencesChange.length == 0 && recurrencesDelete.length > 0) {
      const today = new Date(); // Fecha actual

      const updatedRecurrences = parentTask.recurrences.filter(recurrence => {
        const taskDate = parseISO(recurrence.taskDate);
        const taskIsoDay = getISODay(taskDate).toString();
      
        // Condición para mantener la tarea si es menor a hoy o no está en los días a eliminar
        return isBefore(taskDate, today) || isToday(taskDate) || !recurrencesDelete.includes(taskIsoDay);
      });

      const filteredRecurringDays = recurringDays
      .filter((item) => item.status == true)
      .map((item) => item.status == true && item.isoDay);

      const newTask = {
        _id: parentTask._id,
        title: title,
        description: parentTask.description,
        taskDate: parentTask.taskDate,
        recurringEndDate: parentTask.recurringEndDate,
        startTime: parentTask.startTime,
        endTime: parentTask.endTime,
        recurringDays: filteredRecurringDays,
        isRecurring: parentTask.isRecurring,
        recurrences: updatedRecurrences,
        status: parentTask.status,
        createdAt: parentTask.createdAt,
        updatedAt: parentTask.updatedAt,
        user: parentTask.user,
      };      
      updateTask(newTask, false);
      setRecurrencesDelete([])
    }
    //Si hay que agregar dias a la recurrencias pero no eliminar niguno
    if (recurrencesChange.length > 0 && recurrencesDelete.length == 0) {
      const filteredRecurringDays = recurringDays
        .filter((item) => item.status == true)
        .map((item) => item.status == true && item.isoDay);

      const forRecurrences = {
        taskDate,
        recurringEndDate,
        startTime,
        endTime,
        recurringDays: recurrencesChange,
      };

      const generatedRecurrences = generateOccurrences(forRecurrences);

      const newRecurrences = [
        ...parentTask.recurrences,
        ...generatedRecurrences,
      ];

      const recurrences = newRecurrences.map((taskMap) =>
        taskMap._id == task._id ? newRecurrence : taskMap
      );

      const newTask = {
        _id: parentTask._id,
        title: title,
        description: parentTask.description,
        taskDate: parentTask.taskDate,
        recurringEndDate: parentTask.recurringEndDate,
        startTime: parentTask.startTime,
        endTime: parentTask.endTime,
        recurringDays: filteredRecurringDays,
        isRecurring: parentTask.isRecurring,
        recurrences: recurrences,
        status: parentTask.status,
        createdAt: parentTask.createdAt,
        updatedAt: parentTask.updatedAt,
        user: parentTask.user,
      };
      updateTask(newTask, false);
      setRecurrencesChange([])
    }

    //Si hay que agregar y eliminar recurrencias
    if (recurrencesChange.length > 0 && recurrencesDelete.length > 0) {
      console.log("dentro los dos mayor que 0");

      const filteredRecurringDays = recurringDays
      .filter((item) => item.status == true)
      .map((item) => item.status == true && item.isoDay);

    const forRecurrences = {
      taskDate,
      recurringEndDate,
      startTime,
      endTime,
      recurringDays: recurrencesChange,
    };

    const generatedRecurrences = generateOccurrences(forRecurrences);

    const today = new Date(); // Fecha actual

    const updatedRecurrences = parentTask.recurrences.filter(recurrence => {
      const taskDate = parseISO(recurrence.taskDate);
      const taskIsoDay = getISODay(taskDate).toString();
    
      // Condición para mantener la tarea si es menor a hoy o no está en los días a eliminar
      return isBefore(taskDate, today) || isToday(taskDate) || !recurrencesDelete.includes(taskIsoDay);
    });

    const newRecurrences = [
      ...updatedRecurrences,
      ...generatedRecurrences,
    ];

    const newTask = {
      _id: parentTask._id,
      title: title,
      description: parentTask.description,
      taskDate: parentTask.taskDate,
      recurringEndDate: parentTask.recurringEndDate,
      startTime: parentTask.startTime,
      endTime: parentTask.endTime,
      recurringDays: filteredRecurringDays,
      isRecurring: parentTask.isRecurring,
      recurrences: newRecurrences,
      status: parentTask.status,
      createdAt: parentTask.createdAt,
      updatedAt: parentTask.updatedAt,
      user: parentTask.user,
    };
    updateTask(newTask, false);
    setRecurrencesChange([])
    setRecurrencesDelete([])
    }

    dialog.close();
    setEditIsActive(false);
  };

  const handleDeleteTask = () => {
    if (!task.recurrenceOf) {
      deleteTask(task._id);
    } else {
      console.log("isrecu");
      const parentTask = tasks.find(
        (taskMap) => taskMap._id == task.recurrenceOf
      );
      const newArray = parentTask.recurrences.filter(
        (taskMap) => taskMap._id != task._id
      );
      const newTask = {
        _id: parentTask._id,
        title: parentTask.title,
        description: parentTask.description,
        taskDate: parentTask.taskDate,
        recurringEndDate: parentTask.recurringEndDate,
        startTime: parentTask.startTime,
        endTime: parentTask.endTime,
        recurringDays: parentTask.recurringDays,
        isRecurring: parentTask.isRecurring,
        recurrences: newArray,
        status: parentTask.status,
        createdAt: parentTask.createdAt,
        updatedAt: parentTask.updatedAt,
        user: parentTask.user,
      };
      updateTask(newTask, false, true);
    }
  };

  return (
    <>
      <div
        className={`w-full  ${
          status == "pending" && `bg-dark-400  border-transparent`
        } ${
          status == "completed" && ` border-dark-400`
        }  rounded-xl px-3 border-2 py-[10px] flex items-center justify-between cursor-pointer`}
        onClick={(e) => handleShowModal(e)}
      >
        <div className="grid max-w-[85%]">
          <span
            className={`font-semibold capitalize truncate ...${
              status == "completed" && "line-through text-dark-100"
            }`}
          >
            {title}
          </span>
          <span
            className={`text-sm font-extralight ${
              status == "completed" && "text-dark-100"
            }`}
          >{`${startTime.slice(0, -3)} - ${endTime.slice(0, -3)}`}</span>
        </div>
        <div
          id={`status_${task._id}`}
          className={`w-5 h-5 rounded-full ${
            status == "pending" && `border`
          }  ${
            status == "completed" &&
            `bg-green-complete flex items-center justify-center`
          }`}
          onClick={handleChangeStatus}
        >
          {status == "completed" && (
            <FaCheck className="text-sm" id={`status_icon_${task._id}`} />
          )}
        </div>
      </div>
      <dialog id={`modal_day_${task._id}`} className="modal">
        <div className="modal-box bg-dark-400 overflow-x-hidden">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setEditIsActive(false)}
            >
              ✕
            </button>
          </form>
          <div
            className={`grid grid-cols-[100%,100%] gap-6 transition-transform duration-500 ${
              editIsActive && "translate-x-[calc(-100%-24px)] "
            }`}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-lg h-fit">Ver Tarea</h3>
              <div className="grid gap-1">
                <span className="font-medium text-sm">Titulo</span>
                <input
                  className="border border-dark-200 bg-transparent font-medium px-2 py-1 rounded text-dark-100 text-sm"
                  value={task.title}
                  disabled
                />
              </div>
              {task?.description?.length > 1 && (
                <div className="grid gap-1">
                  <span className="font-medium text-sm">Descripcion</span>
                  <textarea
                    className="border border-dark-200 bg-transparent font-medium px-2 py-1 rounded text-dark-100 text-sm"
                    value={task.description}
                    disabled
                  />
                </div>
              )}
              <div className="flex gap-5">
                <div>
                  <span className="font-medium text-sm">Fecha de Inicio</span>
                  <p className="border border-dark-200 bg-transparent font-medium px-2 py-1 rounded text-dark-100 text-sm flex items-center gap-1">
                    {task.taskDate}
                    <RiCalendar2Line />
                  </p>
                </div>
                <div>
                  <span className="font-medium text-sm">Fecha de Fin</span>
                  <p className="border border-dark-200 bg-transparent font-medium px-2 py-1 rounded text-dark-100 text-sm flex items-center gap-1">
                    {task.recurringEndDate} <RiCalendar2Line />
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div>
                  <span className="font-medium text-sm">Hora de Inicio</span>
                  <p className="border border-dark-200 bg-transparent font-medium px-2 py-1 rounded text-dark-100 text-sm flex items-center gap-1">
                    {task.startTime.slice(0, -3)}
                    <RiTimeLine />
                  </p>
                </div>
                <div>
                  <span className="font-medium text-sm">Hora de Fin</span>
                  <p className="border border-dark-200 bg-transparent font-medium px-2 py-1 rounded text-dark-100 text-sm flex items-center gap-1">
                    {task.endTime.slice(0, -3)}
                    <RiTimeLine />
                  </p>
                </div>
              </div>
              <div>
                <span className="font-bold">Estado</span>
                <p>{task.status}</p>
              </div>

              <div className="flex gap-5">
                <div>
                  <span className="font-medium text-sm">Creado el</span>
                  <p className="border border-dark-200 bg-transparent font-medium px-2 py-1 rounded text-dark-100 text-sm flex items-center gap-1">
                    {task.createdAt
                      ? format(new Date(task.createdAt), "yyyy-MM-dd")
                      : "cargando..."}
                    <RiCalendarCheckLine />
                  </p>
                </div>
                <div>
                  <span className="font-medium text-sm">Actualizado el</span>
                  <p className="border border-dark-200 bg-transparent font-medium px-2 py-1 rounded text-dark-100 text-sm flex items-center gap-1">
                    {task.updatedAt
                      ? format(new Date(task.updatedAt), "yyyy-MM-dd")
                      : "cargando..."}
                    <RiCalendarScheduleLine />
                  </p>
                </div>
              </div>
              {task.isRecurring && (
                <div>
                  <span className="font-medium text-sm">
                    Se repite todos los
                  </span>
                  <div className="flex gap-2">
                    {task.recurringDays.map((day) => (
                      <p
                        className="border px-2 rounded-full border-violet-main text-sm bg-violet-main capitalize"
                        key={day}
                      >
                        {task.recurringDays.length >= 5
                          ? daysOfWeek[day].slice(0, 3)
                          : daysOfWeek[day]}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex mt-4 gap-2 justify-between max-w-[310px] self-end col-span-3">
                <button
                  type="button"
                  className="h-[30px] focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2.5 me-2  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 flex items-center gap-1"
                  onClick={() => handleDeleteTask()}
                >
                  <RiDeleteBin6Line className="text-lg font-bold" />
                  Eliminar Tarea
                </button>
                <div
                  className="h-[30px] cursor-pointer bg-violet-main text-white text-sm px-2 py-2.5 rounded-lg w-fit font-semibold flex items-center gap-1"
                  onClick={() => setEditIsActive(true)}
                >
                  <RiPencilFill className="text-lg font-bold" />
                  Editar Tarea
                </div>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(
                task.recurrenceOf ? onSubmitRecurrence : onSubmit
              )}
            >
              <h3 className="font-bold text-lg mb-2">Editar Tarea</h3>
              <div className="grid  gap-y-4">
                <div className="grid">
                  <label className="font-medium text-sm"> Titulo</label>
                  <input
                    type={"text"}
                    className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-44 text-sm transition duration-300 ease focus:outline-none focus:border-violet-main autofill:bg-transparent col-start-1 row-start-2"
                    {...register("title")}
                  />
                </div>
                <div className="grid">
                  <label className="font-medium text-sm"> Descripcion</label>
                  <textarea
                    className="border border-dark-200 bg-transparent font-medium px-2 py-1 rounded text-sm transition duration-300 ease focus:outline-none focus:border-violet-main autofill:bg-transparent"
                    {...register("description")}
                  />
                </div>
                <div className="flex gap-5">
                  <div className="grid">
                    <label className="font-medium text-sm">
                      {" "}
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      {...register("taskDate")}
                      // onChange={(e) => handleSelectedDate(e)}
                      required
                      className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold row-start-4"
                    />
                  </div>
                  <div className="grid">
                    <label className="font-medium text-sm"> Fecha de Fin</label>
                    <input
                      type="date"
                      {...register("recurringEndDate")}
                      // onChange={(e) => handleSelectedDate(e)}
                      required
                      className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold row-start-4"
                    />
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="grid">
                    <label className="font-medium text-sm">
                      {" "}
                      Hora de Inicio
                    </label>
                    <input
                      type="time"
                      {...register("startTime")}
                      required
                      className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold row-start-4"
                    />
                  </div>
                  <div className="grid">
                    <label className="font-medium text-sm"> Hora de Fin</label>
                    <input
                      type="time"
                      {...register("endTime")}
                      required
                      className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold row-start-4"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-medium text-sm"> Repetir los</label>
                  <div className="flex gap-1 max-[425px]:max-w-[240px] justify-between justify-self-center">
                    {recurringDays.map((item) => (
                      <ItemRecurrent
                        register={register}
                        handleCheck={handleCheckRecurringDays}
                        setRecurringDays={setRecurringDays}
                        recurringDays={recurringDays}
                        status={item.status}
                        day={item.name}
                        isoDay={item.isoDay}
                        key={item.isoDay}
                        disabled={taskDate == endTaskDate}
                        task={task}
                        setRecurrencesChange={setRecurrencesChange}
                        setRecurrencesDelete={setRecurrencesDelete}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex mt-4 gap-2 justify-end">
                <div
                  className="cursor-pointer  text-white text-sm px-4 py-[6px] rounded-lg w-fit font-semibold flex items-center"
                  onClick={() => setEditIsActive(false)}
                >
                  Cancelar
                </div>
                <button className="cursor-pointer bg-violet-main text-white text-sm px-4 py-[6px] rounded-lg w-fit font-semibold">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
