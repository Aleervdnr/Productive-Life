import { getISODay } from "date-fns";
import useWindowSize from "../hooks/useWindowSize.jsx";
import { useTasks } from "../context/TasksContext.jsx";

export function TabMenu({ items, tabActive, handleChangeTab, weeklyTasks }) {
  const { tasksIsLoading } = useTasks();
  const { width } = useWindowSize();
  return (
    <div className="h-screen font-medium flex justify-between gap-2 lg:h-[calc(100%-56px)] lg:relative ">
      {items.map((item, i) => (
        <div
          key={i}
          className={`px-[5px] py-[3px] h-fit lg:h-full rounded-t-lg w-full grid justify-items-center lg:grid-rows-[23px,1fr] ${
            tabActive.name == item.name && `bg-dark-400`
          } lg:rounded-2xl lg:py-2 lg:bg-dark-500`}
          onClick={() => handleChangeTab(item)}
        >
          {width <= 425 && item.name.charAt(0)}
          {(width > 425) & (width < 1024) ? item.name.slice(0, 3) : null}
          {width >= 1024 && item.name}
          <div
            className={`w-[calc(100vw-40px)] h-[calc(100vh-143px)] absolute top-[38px] left-5 bg-dark-400 rounded lg:w-full px-2 py-2 ${
              tabActive.name !== item.name && `max-lg:hidden`
            } lg:static lg:h-full lg:p-0 lg:bg-transparent lg:overflow-auto`}
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
      <span className="font-extralight text-dark-100 lg:hidden">
        {task.startTime.slice(0, -3)}
      </span>
      <div className="w-[85%] flex items-center lg:w-full">
        <div className="w-[10px] h-[1px] bg-dark-100 opacity-50 lg:hidden"></div>
        <div className="font-medium text-base lg:text-sm w-full text-center bg-violet-main  rounded-lg py-2 lg:py-1">
          {task.title}{" "}
        </div>
        <div className="w-[10px] h-[1px] bg-dark-100 opacity-50 lg:hidden"></div>
      </div>
    </div>
  );
}
