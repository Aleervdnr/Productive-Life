import { useEffect, useState } from "react";
import TodayTasks from "../components/widgets-tasks/TodayTasks";
import WeekTasks from "../components/widgets-tasks/WeekTasks";
import MonthTasks from "../components/widgets-tasks/MonthTasks";
import TaskForm from "../components/taskForm/TaskForm.jsx";
import { useTasks } from "../context/TasksContext.jsx";

export default function TasksPage({ setActiveItem }) {
  const { getTasks, tasks, setTasksIsLoading } = useTasks();

  useEffect(() => {
    setActiveItem("tasks");
    getTasks();
    setTasksIsLoading(false);
  }, []);

  const [tabActive, setTabActive] = useState("hoy");

  const handleChangeTab = (name) => {
    setTabActive(name);
  };

  return (
    <div className="w-full h-[calc(100vh-55px)] lg:h-screen  overflow-hidden">
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
        } lg:w-full lg:h-screen lg:grid-cols-4 lg:grid-rows-[38vh,14vh,calc(48vh-40px)] lg:p-3 lg:justify-items-center lg:gap-2`}
      >
        <TodayTasks />
        <WeekTasks />
        <MonthTasks />
        <div className="max-lg:hidden w-full flex justify-between row-start-2 col-start-2 col-end-5">
          <div className="h-full border-[2px] border-dark-400 grid place-content-center rounded-lg px-4">
            <span className="text-2xl">{tasks.length}</span>
            <span>Tareas Completadas</span>
          </div>
          <div className="h-full border-[2px] border-dark-400 grid place-content-center rounded-lg px-4">
            <span className="text-2xl">{tasks.length}</span>
            <span>Tareas Para Hacer</span>
          </div>
          <div className="h-full border-[2px] border-dark-400 grid place-content-center rounded-lg px-4">
            <span className="text-2xl">{tasks.length}</span>
            <span>Tareas Atrasadas</span>
          </div>
          <div className="h-full border-[2px] border-dark-400 grid place-content-center rounded-lg px-4">
            <span className="text-2xl">{tasks.length}</span>
            <span>Tareas Totales</span>
          </div>
        </div>
      </div>
      <TaskForm />
    </div>
  );
}
