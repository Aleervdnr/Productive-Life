import React, { useEffect, useState } from "react";
import { TabMenu } from "../TabMenu";
import { useTasks } from "../../context/TasksContext";
import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  getISODay,
  isMonday,
} from "date-fns";
import TaskForm from "../taskForm/TaskForm";

export default function WeekTasks() {
  const [tabActive, setTabActive] = useState({ name: "Lun", isoDay: 1 });
  const { tasks, setWeeklyTasks, weeklyTasks } = useTasks();

  // Filtrar tareas de la semana actual
  const filterWeeklyTasks = () => {
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 });

    const filteredTasks = tasks.filter((task) => {
      const taskDate = new Date(`${task.taskDate}T${task.startTime}`);
      return isWithinInterval(taskDate, {
        start: startOfCurrentWeek,
        end: endOfCurrentWeek,
      });
    });

    setWeeklyTasks(filteredTasks);
  };

  useEffect(() => {
    filterWeeklyTasks();
  }, [tasks]);

  const handleChangeTab = (name) => {
    setTabActive(name);
  };
  return (
    <div className="w-[100vw]  px-5 lg:row-start-3 lg:col-span-4 lg:bg-dark-400 lg:w-full">
      <div className="lg:grid lg:w-full lg:grid-cols-3 lg:justify-items-center lg:content-center">
        <h2 className="text-center hidden lg:block font-bold text-lg my-2 lg:col-start-2">
          Mi Semana
        </h2>
        <TaskForm styles={"max-lg:hidden"} />
      </div>
      <TabMenu
        items={[
          { name: "Lun", isoDay: 1 },
          { name: "Mar", isoDay: 2 },
          { name: "Mier", isoDay: 3 },
          { name: "Jue", isoDay: 4 },
          { name: "Vier", isoDay: 5 },
          { name: "Sab", isoDay: 6 },
          { name: "Dom", isoDay: 7 },
        ]}
        tabActive={tabActive}
        handleChangeTab={handleChangeTab}
        weeklyTasks={weeklyTasks}
      />
    </div>
  );
}
