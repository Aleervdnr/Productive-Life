import { FaCheck } from "react-icons/fa6";
import { useTasks } from "../../context/TasksContext";

export default function ItemTodayTask({ task }) {
  const { title, startTime, endTime, status, _id } = task;
  const { updateTask } = useTasks();

  const handleChangeStatus = (e) => {
    const newTask = task;
    if (status == "completed") newTask.status = "pending";
    if (status == "pending") newTask.status = "completed";

    updateTask(newTask);
  };

  const handleShowModal = (e) => {
    if(e.target.id == `status_${task._id}` || e.target.id == `status_icon_${task._id}`){
      e.preventDefault()
    }else{
      document.getElementById(`modal_day_${task._id}`).showModal();

    }
  };

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
          {status == "completed" && <FaCheck className="text-sm" id={`status_icon_${task._id}`}/>}
        </div>
      </div>
      <dialog id={`modal_day_${task._id}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click on ✕ button to close</p>
        </div>
      </dialog>
    </>
  );
}

{
  /* You can open the modal using document.getElementById('ID').showModal() method */
}
