import { useEffect, useState } from "react";
import TodayTasks from "../components/widgets-tasks/TodayTasks";
import WeekTasks from "../components/widgets-tasks/WeekTasks";
import MonthTasks from "../components/widgets-tasks/MonthTasks";
import { useTasks } from "../context/TasksContext.jsx";
import TaskFormButton from "../components/taskForm/TaskFormButton.jsx";
import { isSameMonth, isSameWeek } from "date-fns";
import { todayDate } from "../libs/Dates.js";


export default function TasksPage({ setActiveItem }) {
  const { getTasks, tasks, setTasksIsLoading } = useTasks();

  useEffect(() => {
    setActiveItem("tasks");
    getTasks()
  }, []);

  const [tabActive, setTabActive] = useState("hoy");

  const handleChangeTab = (name) => {
    setTabActive(name);
  };

  const weeklyTasks = tasks.filter((task) => isSameWeek(new Date(task.taskDate), new Date(todayDate)))
  const monthlyTasks = tasks.filter((task) => isSameMonth(new Date(task.taskDate), new Date(todayDate)))

  return (
    <div className="w-full h-[calc(100dvh-55px)] lg:h-screen  overflow-hidden relative">
      <div className="font-medium flex gap-2 px-5 mb-3 lg:hidden">
        <div
          className={`px-[5px] py-[3px] rounded ${
            tabActive == "hoy" && `bg-dark-400`
          }`}
          onClick={() => handleChangeTab("hoy")}
        >
          Hoy
        </div>
        <div
          className={`px-[5px] py-[3px] rounded ${
            tabActive == "semana" && `bg-dark-400`
          }`}
          onClick={() => handleChangeTab("semana")}
        >
          Semana
        </div>
        <div
          className={`px-[5px] py-[3px] rounded ${
            tabActive == "mes" && `bg-dark-400`
          }`}
          onClick={() => handleChangeTab("mes")}
        >
          Mes
        </div>
      </div>
      <div
        className={`z-10 grid grid-cols-[repeat(3,1fr)] transition-transform ease-in duration-300 ${
          tabActive == "semana" && "max-lg:translate-x-[calc(-100vw)]"
        } ${
          tabActive == "mes" && "max-lg:translate-x-[calc(-200vw)]"
        } lg:w-full lg:h-screen lg:grid-cols-[repeat(3 , 33.33%)] lg:grid-rows-[1fr,auto,calc(48vh-40px)] lg:p-3 lg:justify-items-center lg:gap-2`}
      >
        <TodayTasks />
        <WeekTasks />
        <MonthTasks />
        <div className="w-full h-full hidden lg:block lg:border-[2px] lg:border-dark-400 lg:rounded-lg"></div>
        <div className="max-lg:hidden w-full grid grid-cols-4 gap-2 row-start-2 col-start-2 col-end-5">
          <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
            <span className="text-xs">Tareas Completadas</span>
            <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
              {tasks.filter((task) => task.status == "completed").length}{" "}
              <span className="lg:text-sm xl:text-lg">de</span> {tasks.length}
            </span>
          </div>
          <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
            <span className="text-xs">Tareas Para Hacer</span>
            <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
              {tasks.filter((task) => task.status == "pending").length}{" "}
              <span className="lg:text-sm xl:text-lg">de</span> {tasks.length}
            </span>
          </div>
          <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
            <span className="text-xs">Tareas Atrasadas</span>
            <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
              {tasks.filter((task) => task.status == "overdue").length}{" "}
              <span className="lg:text-sm xl:text-lg">de</span> {tasks.length}
            </span>
          </div>
          <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
            <span className="text-xs">Progreso mensual</span>
            <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
              {Math.round(
                (monthlyTasks.filter((task) => task.status == "completed").length /
                  monthlyTasks.length) *
                  100
              )}
              %
            </span>
          </div>
        </div>
      </div>
      <TaskFormButton styles={"lg:hidden"} />
    </div>
  );
}
