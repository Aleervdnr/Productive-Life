import { FaCheck } from "react-icons/fa6";
import { useTasks } from "../../context/TasksContext";

export default function ItemTodayTask({ task }) {
    const {title, startTime, endTime, status, _id} = task
    const {updateTask} = useTasks()

    const handleChangeStatus = () => {
      const newTask = task
      if(status == "completed")newTask.status = "pending"
      if(status == "pending")newTask.status = "completed"
      
      updateTask(newTask)
    }
  return (
    <div className={`w-full max-h-[64px] ${status == "pending" && `bg-dark-400`} ${status == "completed" && `border-2 border-dark-400`}  rounded-xl px-3 py-[10px] flex items-center justify-between`}>
      <div className="grid">
        <span className={`font-semibold capitalize ${status == "completed" && "line-through text-dark-100"}`}>{title}</span>
        <span className={`text-sm font-extralight ${status == "completed" && "text-dark-100"}`}>{`${startTime.slice(0,-3)} - ${endTime.slice(0,-3)}`}</span>
      </div>
      <div className={`w-5 h-5 rounded-full ${status == "pending" && `border`}  ${status == "completed" && `bg-green-complete flex items-center justify-center`}`}
      onClick={handleChangeStatus}>
        {status == "completed" && <FaCheck className="text-sm"/>}  
      </div>
    </div>
  );
}
