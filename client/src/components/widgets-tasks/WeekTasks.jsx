import { useEffect, useState } from "react";
import { TabMenu } from "../TabMenu";
import { useTasks } from "../../context/TasksContext";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import TaskFormButton from "../TaskFormButton";

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
    <div className="w-[100vw] h-[calc(100vh-97px)] max-lg:relative px-5 py-2 lg:row-start-3 lg:col-span-4 lg:bg-dark-400 lg:w-full lg:h-full">
      <div className="lg:grid lg:w-full lg:grid-cols-3 lg:justify-items-center lg:content-center lg:py-1">
        <h2 className="text-center hidden lg:block font-medium text-2xl my-2 lg:col-start-2">
          Mi Semana
        </h2>
        <TaskFormButton styles={"max-lg:hidden text-xxs"} />
      </div>
      <TabMenu
        items={[
          { name: "Lunes", isoDay: 1 },
          { name: "Martes", isoDay: 2 },
          { name: "Miercoles", isoDay: 3 },
          { name: "Jueves", isoDay: 4 },
          { name: "Viernes", isoDay: 5 },
          { name: "Sabado", isoDay: 6 },
          { name: "Domingo", isoDay: 7 },
        ]}
        tabActive={tabActive}
        handleChangeTab={handleChangeTab}
        weeklyTasks={weeklyTasks}
      />
    </div>
  );
}
