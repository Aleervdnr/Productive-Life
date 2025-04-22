import { getISODay, isBefore } from "date-fns";
import useWindowSize from "../hooks/useWindowSize.jsx";
import { useTasks } from "../context/TasksContext.jsx";
import { useUi } from "../context/UiContext.jsx";
import { useEffect } from "react";

export function TabMenu({ items, tabActive, handleChangeTab, weeklyTasks }) {
  const { tasksIsLoading } = useTasks();
  const { width } = useWindowSize();
  const { scrollbarStyles } = useUi();

  return (
    <div className="h-[55px] font-semibold flex justify-between gap-2 lg:h-[calc(100%-56px)] lg:relative ">
      {items.map((item, i) => (
        <div
          key={i}
          className={`px-[5px] py-[5px] h-full lg:h-full rounded-md w-full text-xs grid place-content-center justify-items-center lg:grid-rows-[23px,1fr] lg:grid-cols-1 bg-dark-400 ${
            tabActive.name == item.name &&
            `max-lg:bg-gradient-to-b from-[#7E73FF] from-25% to-[#4C4599] to-85%`
          } lg:rounded-2xl lg:py-2 lg:bg-dark-500`}
          onClick={() => width < 1024 && handleChangeTab(item)}
        >
          <div className="flex flex-col justify-center items-center relative">
            {width < 375 && item.name.charAt(0)}
            {(width >= 375) & (width < 768) ? item.name.slice(0, 3) : null}
            {width >= 768 && item.name}
            {width < 1024 && <span>{item.day}</span>}
            {item.isToday && width < 1024 && (
              <div className="w-1 h-1 bg-yellow-300 absolute bottom-[-4px]"></div>
            )}
          </div>

          <div
            className={` bg-dark-400 rounded max-lg:hidden lg:w-full px-2 py-2lg:static lg:h-full lg:p-0 lg:bg-transparent lg:overflow-auto`}
            style={scrollbarStyles}
          >
            {tasksIsLoading ? (
              <>
                <div className="w-full h-[28px] mt-2 rounded-lg bg-dark-400 animate-pulse"></div>
                <div className="w-full h-[28px] mt-2 rounded-lg bg-dark-400 animate-pulse"></div>
                <div className="w-full h-[28px] mt-2 rounded-lg bg-dark-400 animate-pulse"></div>
              </>
            ) : (
              weeklyTasks.map(
                (task) =>
                  getISODay(new Date(`${task.taskDate}T${task.startTime}`)) ==
                    item.isoDay && <TabMenuItem task={task} key={task._id} />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TabMenuItem({ task }) {
  return (
    <div className="mt-2 flex gap-1 items-center justify-between relative">
      <div className="w-full flex items-center lg:w-full">
        <div
          className={`font-medium text-base lg:text-sm w-full text-center bg-violet-main  rounded-lg py-2 lg:py-1 ${
            task.status == "completed" && "line-through"
          } ${isBefore(new Date(`${task.taskDate}T${task.startTime}`), new Date()) && "opacity-50"}`}
        >
          {task.title}{" "}
        </div>
      </div>
    </div>
  );
}
