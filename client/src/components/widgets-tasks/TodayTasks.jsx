import { useTasks } from "../../context/TasksContext";
import ItemTodayTask from "./ItemTodayTask";
import { todayDate } from "../../libs/Dates.js";
import { useEffect, useState } from "react";
import useWindowSize from "../../hooks/useWindowSize.jsx";
import { useUi } from "../../context/UiContext.jsx";
import { AnimatedCounter } from "../AnimatedCounter.jsx";
import ItemTask from "../ItemTask/ItemTask.jsx";
import { useTranslation } from "../../hooks/UseTranslation.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import useMessageNoTasks from "../../hooks/useMessageNoTasks.jsx";

export default function TodayTasks() {
  const { tasks, tasksIsLoading } = useTasks();
  const { t } = useTranslation();
  const {randomMessage} = useMessageNoTasks()
  const { width } = useWindowSize();

  const filteredTasks = tasks
    .filter((task) => task.taskDate == todayDate)
    .sort((a, b) => {
      // Convertir el tiempo de "HH:mm:ss" a un timestamp para ordenarlos
      const timeA = new Date(`1970-01-01T${a.startTime}`).getTime();
      const timeB = new Date(`1970-01-01T${b.startTime}`).getTime();
      return timeA - timeB; // Orden ascendente
    });

  const { scrollbarStyles } = useUi();

  return (
    <div
      id={width >= 1024 ? "step-0" : null}
      className={`max-lg:w-[100vw] max-lg:h-[calc(100vh-145px)] max-lg:grid max-lg:grid-rows-[25px,40dvh,33px,136px] px-5 py-3 lg:w-full lg:row-start-1 lg:row-end-3 lg:border-[2px] lg:border-dark-400 lg:rounded-lg lg:p-3 overflow-scroll`}
      style={scrollbarStyles}
    >
      <span className="text-lg font-semibold">{t("tasks.todayTasks.title")}</span>
      <div
        className={`${
          tasksIsLoading
            ? "flex flex-col gap-2"
            : `${
                tasks.filter((task) => task.taskDate == todayDate).length > 0
                  ? "flex flex-col gap-2"
                  : " w-full h-full lg:h-[calc(100%-49px)] py-8 grid place-content-center"
              }`
        } mt-2 overflow-auto`}
      >
        {tasksIsLoading ? (
          <>
            <div className="w-full h-[68px] rounded-xl bg-dark-400 animate-pulse"></div>
            <div className="w-full h-[68px] rounded-xl bg-dark-400 animate-pulse"></div>
            <div className="w-full h-[68px] rounded-xl bg-dark-400 animate-pulse"></div>
          </>
        ) : filteredTasks.length ? (
          filteredTasks.map((task) => <ItemTask task={task} key={task._id} />)
        ) : (
          <p className="text-sm text-center h-full">{randomMessage}</p>
        )}
      </div>
      <div className="w-full h-[1px] bg-dark-200 my-4 lg:hidden"></div>
      <div className="w-full grid grid-cols-2 gap-2 lg:hidden">
        <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
          <span className="text-xs">{t("tasks.cardProgress.completed")}</span>
          <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
            {filteredTasks.filter((task) => task.status == "completed").length}{" "}
            <span className="lg:text-sm xl:text-lg">{t("tasks.cardProgress.of")}</span>{" "}
            {filteredTasks.length}
          </span>
        </div>
        <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
          <span className="text-xs">{t("tasks.cardProgress.toDo")}</span>
          <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
            {filteredTasks.filter((task) => task.status == "pending").length}{" "}
            <span className="lg:text-sm xl:text-lg">{t("tasks.cardProgress.of")}</span>{" "}
            {filteredTasks.length}
          </span>
        </div>
        <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
          <span className="text-xs">{t("tasks.cardProgress.overdue")}</span>
          <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
            {filteredTasks.filter((task) => task.status == "overdue").length}{" "}
            <span className="lg:text-sm xl:text-lg">{t("tasks.cardProgress.of")}</span>{" "}
            {filteredTasks.length}
          </span>
        </div>
        <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
          <span className="text-xs">{t("tasks.cardProgress.dailyProgress")}</span>
          <AnimatedCounter
            value={
              filteredTasks.length > 0
                ? (filteredTasks.filter((task) => task.status === "completed")
                    .length /
                    filteredTasks.length) *
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
