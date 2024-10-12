import { getISODay } from "date-fns";

export function TabMenu({ items, tabActive, handleChangeTab, weeklyTasks }) {
  return (
    <div className="relative font-medium flex justify-between gap-2 lg:max-h-[180px]">
      {items.map((item, i) => (
        <div
          key={i}
          className={`px-[5px] py-[3px] rounded-t-lg w-full grid justify-items-center lg:grid-rows-[23px,1fr] ${
            tabActive.name == item.name && `bg-dark-400`
          } lg:rounded-lg lg:py-2 lg:bg-dark-500`}
          onClick={() => handleChangeTab(item)}
        >
          {item.name}
          <div className={`w-full absolute top-[28px] left-0 bg-dark-400 rounded lg:w-full px-2 py-2 ${tabActive.name !== item.name && `max-lg:hidden`} lg:static lg:p-0 lg:bg-transparent lg:overflow-auto`}>
            {weeklyTasks.map(
              (task) =>
                getISODay(new Date(`${task.taskDate}T${task.startTime}`)) ==
                  item.isoDay && <TabMenuItem task={task} key={task._id} />
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
        <div className="font-semibold text-base lg:text-sm w-full text-center bg-violet-main  rounded-full py-2 lg:py-1">
          {task.title}{" "}
        </div>
        <div className="w-[10px] h-[1px] bg-dark-100 opacity-50 lg:hidden"></div>
      </div>
    </div>
  );
}
