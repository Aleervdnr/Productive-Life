import { FaCheck } from "react-icons/fa6";
import { useTasks } from "../../context/TasksContext";
import { useForm } from "react-hook-form";
import { useDate } from "../../context/DateContext.jsx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiPencilFill } from "react-icons/ri";
import { useState } from "react";
import { format } from "date-fns";
import { deleteTasksRequest } from "../../api/tasks.js";

export default function ItemTodayTask({ task }) {
  const { title, startTime, endTime, status, _id } = task;
  const { updateTask, deleteTask } = useTasks();
  const { register, setValue, handleSubmit } = useForm();
  const { nowDate } = useDate();
  const [editIsActive, setEditIsActive] = useState(false);

  const dialog = document.getElementById(`modal_day_${task._id}`);

  const handleChangeStatus = (e) => {
    const newTask = task;
    if (status == "completed") newTask.status = "pending";
    if (status == "pending") newTask.status = "completed";

    updateTask(newTask, true);
  };

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

    const updatedTask = {
      _id: task._id,
      title,
      description,
      taskDate,
      recurringEndDate,
      startTime,
      endTime,
      recurringDays: task.recurringDays,
      isRecurring: task.isRecurring,
      status: task.status,
    };

    updateTask(updatedTask, false);
    dialog.close();
    setEditIsActive(false);
  };

  const handleDeleteTask = () => {
    deleteTask(task._id)
  }

  return (
    <>
      <div
        className={`w-full max-h-[64px] ${
          status == "pending" && `bg-dark-400`
        } ${
          status == "completed" && `border-2 border-dark-400`
        }  rounded-xl px-3 py-[10px] flex items-center justify-between`}
        onClick={(e) => handleShowModal(e)}
      >
        <div className="grid ">
          <span
            className={`font-semibold capitalize ${
              status == "completed" && "line-through text-dark-100"
            }`}
          >
            {title}
          </span>
          <span
            className={`text-base font-extralight ${
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
        <div className="modal-box overflow-hidden">
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
            <div className="grid grid-cols-3 gap-y-4">
              <div>
                <span className="font-bold">Titulo</span>
                <p>{task.title}</p>
              </div>
              <div className="col-span-2">
                <span className="font-bold">Descripcion</span>
                <p>{task.description}</p>
              </div>
              <div>
                <span className="font-bold">Fecha de Inicio</span>
                <p>{task.taskDate}</p>
              </div>
              <div>
                <span className="font-bold">Fecha de Fin</span>
                <p>{task.recurringEndDate}</p>
              </div>
              <div className="col-start-1">
                <span className="font-bold">Hora de Inicio</span>
                <p>{task.recurringEndDate}</p>
              </div>
              <div className="col-start-2">
                <span className="font-bold">Hora de Inicio</span>
                <p>{task.recurringEndDate}</p>
              </div>
              <div>
                <span className="font-bold">Estado</span>
                <p>{task.status}</p>
              </div>
              <div>
                <span className="font-bold">Creado el</span>
                <p>{format(new Date(task.createdAt), "yyyy-MM-dd")}</p>
              </div>
              <div>
                <span className="font-bold">Actualizado el</span>
                <p>{format(new Date(task.updatedAt), "yyyy-MM-dd")}</p>
              </div>
              <div className="flex mt-4 gap-2 justify-end col-span-3">
                <button
                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 flex items-center gap-1"
                  onClick={() => handleDeleteTask() }
                >
                  <RiDeleteBin6Line className="text-lg font-bold" />
                  Eliminar Tarea
                </button>
                <div
                  className="cursor-pointer bg-violet-main text-white text-sm px-4 py-[6px] rounded-lg w-fit font-semibold flex items-center gap-1"
                  onClick={() => setEditIsActive(true)}
                >
                  <RiPencilFill className="text-lg font-bold" />
                  Editar Tarea
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3 className="font-bold text-lg mb-2">Editar Tarea</h3>
              <div className="grid grid-cols-2 gap-y-4">
                <div className="grid">
                  <label className="font-semibold"> Titulo</label>
                  <input
                    type={"text"}
                    className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-44 text-xs transition duration-300 ease focus:outline-none focus:border-violet-main autofill:bg-transparent col-start-1 row-start-2"
                    {...register("title")}
                  />
                </div>
                <div className="grid">
                  <label className="font-semibold"> Descripcion</label>
                  <input
                    type={"text"}
                    className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-44 text-xs  transition duration-300 ease focus:outline-none focus:border-violet-main autofill:bg-transparent"
                    {...register("description")}
                  />
                </div>
                <div className="grid">
                  <label className="font-semibold"> Fecha de Inicio</label>
                  <input
                    type="date"
                    {...register("taskDate")}
                    min={nowDate}
                    // onChange={(e) => handleSelectedDate(e)}
                    required
                    className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold row-start-4"
                  />
                </div>
                <div className="grid">
                  <label className="font-semibold"> Fecha de Fin</label>
                  <input
                    type="date"
                    {...register("recurringEndDate")}
                    min={nowDate}
                    // onChange={(e) => handleSelectedDate(e)}
                    required
                    className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold row-start-4"
                  />
                </div>
                <div className="grid">
                  <label className="font-semibold"> Hora de Inicio</label>
                  <input
                    type="time"
                    {...register("startTime")}
                    required
                    className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold row-start-4"
                  />
                </div>
                <div className="grid">
                  <label className="font-semibold"> Hora de Fin</label>
                  <input
                    type="time"
                    {...register("endTime")}
                    required
                    className="border border-dark-200 bg-transparent rounded px-[10px] py-[5px] w-36 text-xs font-semibold row-start-4"
                  />
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

{
  /* You can open the modal using document.getElementById('ID').showModal() method */
}
