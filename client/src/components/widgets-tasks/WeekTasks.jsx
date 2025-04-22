import { useEffect, useState } from "react";
import { TabMenu } from "../TabMenu";
import { useTasks } from "../../context/TasksContext";
import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  getDate,
  addDays,
  isToday,
  format,
} from "date-fns";
import TaskFormButton from "../taskForm/TaskFormButton";
import useWindowSize from "../../hooks/useWindowSize";
import { AnimatedCounter } from "../AnimatedCounter";
import ItemTask from "../ItemTask/ItemTask";
import useMessageNoTasks from "../../hooks/useMessageNoTasks";
import { useTranslation } from "../../hooks/UseTranslation";
import { useLanguage } from "../../context/LanguageContext";

export default function WeekTasks() {
  const [tabActive, setTabActive] = useState({ name: "Lunes", isoDay: 1 });
  const [currentTabTasks, setCurrentTabTasks] = useState([]);
  const [week, setWeek] = useState([
    { name: "Lunes", isoDay: 1, day: "..." },
    { name: "Martes", isoDay: 2, day: "..." },
    { name: "Miercoles", isoDay: 3, day: "..." },
    { name: "Jueves", isoDay: 4, day: "..." },
    { name: "Viernes", isoDay: 5, day: "..." },
    { name: "Sabado", isoDay: 6, day: "..." },
    { name: "Domingo", isoDay: 7, day: "..." },
  ]);
  const { tasks, tasksIsLoading, setWeeklyTasks, weeklyTasks } = useTasks();
  const { randomMessage } = useMessageNoTasks();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const { width } = useWindowSize();

  // Filtrar tareas de la semana actual
  const filterWeeklyTasks = () => {
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 });

    const filteredTasks = tasks
      .filter((task) => {
        const taskDate = new Date(`${task.taskDate}T${task.startTime}`);
        return isWithinInterval(taskDate, {
          start: startOfCurrentWeek,
          end: endOfCurrentWeek,
        });
      })
      .sort((a, b) => {
        // Convertir el tiempo de "HH:mm:ss" a un timestamp para ordenarlos
        const timeA = new Date(`1970-01-01T${a.startTime}`).getTime();
        const timeB = new Date(`1970-01-01T${b.startTime}`).getTime();
        return timeA - timeB; // Orden ascendente
      });

    setWeeklyTasks(filteredTasks);
  };

  const filterCurrentTabTasks = (name) => {
    const filteredTasks = tasks
      .filter((task) => task.taskDate == name)
      .sort((a, b) => {
        // Convertir el tiempo de "HH:mm:ss" a un timestamp para ordenarlos
        const timeA = new Date(`1970-01-01T${a.startTime}`).getTime();
        const timeB = new Date(`1970-01-01T${b.startTime}`).getTime();
        return timeA - timeB; // Orden ascendente
      });
    setCurrentTabTasks(filteredTasks);
  };

  useEffect(() => {
    filterWeeklyTasks();
  }, [tasks]);

  useEffect(() => {
    filterCurrentTabTasks(tabActive.currentDay);
  }, [tasks, tabActive]);

  useEffect(() => {
    if (language == "es"){
      setWeek([
        { name: "Lunes", isoDay: 1, day: "..." },
        { name: "Martes", isoDay: 2, day: "..." },
        { name: "Miercoles", isoDay: 3, day: "..." },
        { name: "Jueves", isoDay: 4, day: "..." },
        { name: "Viernes", isoDay: 5, day: "..." },
        { name: "Sabado", isoDay: 6, day: "..." },
        { name: "Domingo", isoDay: 7, day: "..." },
      ]);
    }
    if (language == "en"){
      setWeek([
        { name: "Monday", isoDay: 1, day: "..." },
        { name: "Tuesday", isoDay: 2, day: "..." },
        { name: "Wednesday", isoDay: 3, day: "..." },
        { name: "Thursday", isoDay: 4, day: "..." },
        { name: "Friday", isoDay: 5, day: "..." },
        { name: "Saturday", isoDay: 6, day: "..." },
        { name: "Sunday", isoDay: 7, day: "..." },
      ]);
    }
  }, [language])
  


  useEffect(() => {
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }); // La semana comienza en lunes

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const currentDay = addDays(startOfCurrentWeek, i); // Sumar días desde el inicio de la semana
      let dayNames = [];
      if (language == "es") {
        dayNames = [
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
          "Domingo",
        ];
      }
      if (language == "en") {
        dayNames = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
      }

      const day = {
        name: dayNames[i],
        isoDay: i + 1,
        day: getDate(currentDay),
        isToday: isToday(currentDay),
        currentDay: format(currentDay, "yyyy-MM-dd"),
      };

      if (isToday(currentDay)) setTabActive(day);

      return day;
    });

    setWeek(weekDays);
  }, []);

  const handleChangeTab = (name) => {
    console.log(name);
    setTabActive(name);
  };
  return (
    <div
      id={width >= 1024 ? "step-3" : null}
      className="w-[100vw] h-[calc(100vh-145px)]  max-lg:relative max-lg:grid max-lg:grid-rows-[55px,38dvh,33px,136px] px-5 max-lg:py-3 lg:row-start-3 lg:col-span-4 lg:bg-dark-400 lg:w-full lg:h-full lg:pb-3"
    >
      <div className="max-lg:hidden lg:grid lg:w-full lg:grid-cols-3 lg:justify-items-center lg:content-center lg:py-1">
        <h2 className="text-center hidden lg:block font-medium text-2xl my-2 lg:col-start-2">
          {t("tasks.weeklyTasks.title")}
        </h2>
        <TaskFormButton styles={"max-lg:hidden text-xxs"} />
      </div>
      <TabMenu
        items={week}
        tabActive={tabActive}
        handleChangeTab={handleChangeTab}
        weeklyTasks={weeklyTasks}
      />
      <div
        className={`${width > 1024 && "hidden"} ${
          tasksIsLoading
            ? "flex flex-col gap-2"
            : `${
                currentTabTasks.length > 0
                  ? "flex flex-col gap-2"
                  : " w-full h-[calc(100%-32px)] grid place-content-center"
              }`
        } mt-3 overflow-auto`}
      >
        {tasksIsLoading ? (
          <>
            <div className="w-full h-[68px] rounded-xl bg-dark-400 animate-pulse"></div>
            <div className="w-full h-[68px] rounded-xl bg-dark-400 animate-pulse"></div>
            <div className="w-full h-[68px] rounded-xl bg-dark-400 animate-pulse"></div>
          </>
        ) : currentTabTasks.length ? (
          currentTabTasks.map((task) => <ItemTask task={task} key={task._id} />)
        ) : (
          <p className="text-sm text-center">{randomMessage}</p>
        )}
      </div>
      <div className="w-full h-[1px] bg-dark-200 my-4 lg:hidden"></div>
      <div className="w-full grid grid-cols-2 gap-2 lg:hidden">
        <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
          <span className="text-xs">{t("tasks.cardProgress.completed")}</span>
          <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
            {weeklyTasks.filter((task) => task.status == "completed").length}{" "}
            <span className="lg:text-sm xl:text-lg">
              {t("tasks.cardProgress.of")}
            </span>{" "}
            {weeklyTasks.length}
          </span>
        </div>
        <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
          <span className="text-xs">{t("tasks.cardProgress.toDo")}</span>
          <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
            {weeklyTasks.filter((task) => task.status == "pending").length}{" "}
            <span className="lg:text-sm xl:text-lg">
              {t("tasks.cardProgress.of")}
            </span>{" "}
            {weeklyTasks.length}
          </span>
        </div>
        <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
          <span className="text-xs">{t("tasks.cardProgress.overdue")}</span>
          <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
            {weeklyTasks.filter((task) => task.status == "overdue").length}{" "}
            <span className="lg:text-sm xl:text-lg">
              {t("tasks.cardProgress.of")}
            </span>{" "}
            {weeklyTasks.length}
          </span>
        </div>
        <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
          <span className="text-xs">
            {t("tasks.cardProgress.weeklyProgress")}
          </span>
          <AnimatedCounter
            value={
              weeklyTasks.length > 0
                ? (weeklyTasks.filter((task) => task.status === "completed")
                    .length /
                    weeklyTasks.length) *
                  100
                : 0
            }
            duration={200}
          />
        </div>
      </div>
    </div>
  );
}
