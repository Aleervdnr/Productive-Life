import { useEffect, useRef, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { AnimatedCounter } from "../AnimatedCounter";
import { useTasks } from "../../context/TasksContext";
import { isSameDay, isSameMonth, isSameWeek } from "date-fns";
import { todayDate } from "../../libs/Dates.js";
import { useTranslation } from "../../hooks/UseTranslation.jsx";

export default function CardsProgress({}) {
  const { t } = useTranslation();
  const detailsRef = useRef(null);

  const { tasks, tasksIsLoading } = useTasks();
  const [dropDownState, setDropDownState] = useState(
    t("tasks.cardProgress.monthlyProgress")
  );
  const [filteredTasks, setFilteredTasks] = useState([]);

  const handleSelect = (e) => {
    if (e.target.id == "monthlyProgress") {
      setFilteredTasks(
        tasks.filter((task) =>
          isSameMonth(new Date(task.taskDate), new Date(todayDate))
        )
      );
      setDropDownState(t("tasks.cardProgress.monthlyProgress"));
    }
    if (e.target.id == "weeklyProgress") {
      setFilteredTasks(
        tasks.filter((task) =>
          isSameWeek(new Date(task.taskDate), new Date(todayDate), {
            weekStartsOn: 0,
          })
        )
      );
      setDropDownState(t("tasks.cardProgress.weeklyProgress"));
    }
    if (e.target.id == "dailyProgress") {
      setFilteredTasks(
        tasks.filter((task) =>
          isSameDay(new Date(task.taskDate), new Date(todayDate))
        )
      );
      setDropDownState(t("tasks.cardProgress.dailyProgress"));
    }
    detailsRef.current.removeAttribute("open");
  };

  useEffect(() => {
    if (
      dropDownState == t("tasks.cardProgress.dailyProgress") &&
      !tasksIsLoading
    ) {
      setFilteredTasks(
        tasks.filter((task) =>
          isSameDay(new Date(task.taskDate), new Date(todayDate))
        )
      );
    }
    if (
      dropDownState == t("tasks.cardProgress.weeklyProgress") &&
      !tasksIsLoading
    ) {
      setFilteredTasks(
        tasks.filter((task) =>
          isSameWeek(new Date(task.taskDate), new Date(todayDate), {
            weekStartsOn: 0,
          })
        )
      );
    }
    if (
      dropDownState == t("tasks.cardProgress.monthlyProgress") &&
      !tasksIsLoading
    ) {
      setFilteredTasks(
        tasks.filter((task) =>
          isSameMonth(new Date(task.taskDate), new Date(todayDate))
        )
      );
    }
  }, [tasks]);

  return (
    <div
      id="step-2"
      className="max-lg:hidden w-full grid grid-cols-4 gap-2 row-start-2 col-start-2 col-end-5"
    >
      <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
        <span className="text-xs">{t("tasks.cardProgress.completed")}</span>
        <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
          {filteredTasks.filter((task) => task.status == "completed").length}{" "}
          <span className="lg:text-sm xl:text-lg">{t("tasks.pomodoroTimer.of")}</span>{" "}
          {filteredTasks.length}
        </span>
      </div>
      <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
        <span className="text-xs">{t("tasks.cardProgress.toDo")}</span>
        <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
          {filteredTasks.filter((task) => task.status == "pending").length}{" "}
          <span className="lg:text-sm xl:text-lg">{t("tasks.pomodoroTimer.of")}</span>{" "}
          {filteredTasks.length}
        </span>
      </div>
      <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
        <span className="text-xs">{t("tasks.cardProgress.overdue")}</span>
        <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
          {filteredTasks.filter((task) => task.status == "overdue").length}{" "}
          <span className="lg:text-sm xl:text-lg">{t("tasks.pomodoroTimer.of")}</span>{" "}
          {filteredTasks.length}
        </span>
      </div>
      <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
        <details className="text-xs relative" ref={detailsRef}>
          <summary className="list-none px-3 flex items-center cursor-pointer">
            {dropDownState}
            <RiArrowDownSLine className="absolute right-4 text-lg text-violet-main" />
            <div className="px-3"></div>
          </summary>
          <ul className="absolute bg-dark-200 w-full">
            <li
              className="cursor-pointer hover:bg-dark-400 px-3 py-2"
              id="monthlyProgress"
              onClick={(e) => handleSelect(e)}
            >
              {t("tasks.cardProgress.monthlyProgress")}
            </li>
            <li
              className="cursor-pointer hover:bg-dark-400 px-3 py-2"
              id="weeklyProgress"
              onClick={(e) => handleSelect(e)}
            >
              {t("tasks.cardProgress.weeklyProgress")}
            </li>
            <li
              className="cursor-pointer hover:bg-dark-400 px-3 py-2"
              id="dailyProgress"
              onClick={(e) => handleSelect(e)}
            >
              {t("tasks.cardProgress.dailyProgress")}
            </li>
          </ul>
        </details>
        <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7 px-3">
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
        </span>
      </div>
    </div>
  );
}
