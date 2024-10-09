import { useTasks } from "../../context/TasksContext";
import ItemTodayTask from "./ItemTodayTask";
import { todayDate } from "../../libs/Dates.js";

export default function TodayTasks() {
  const {tasks} = useTasks()
  return (
    <div className='max-lg:w-[100vw] px-5 lg:w-full lg:row-start-1 lg:row-end-3 lg:border-[2px] lg:border-dark-400 lg:rounded-lg lg:p-3'>
      <span className="text-xl font-semibold">Tareas del dia</span>
      <div className="flex flex-col gap-2 mt-2 overflow-auto">
        {tasks? 
          tasks.map(task => task.taskDate == todayDate ? <ItemTodayTask task={task} key={task._id}/> : null)
          :
          <div>No hay tareas para hoy</div>
          }
      </div>
    </div>
  )
}
