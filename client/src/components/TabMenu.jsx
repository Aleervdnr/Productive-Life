export function TabMenu({ items, tabActive, handleChangeTab }) {
  return (
    <div className="font-medium flex justify-between gap-2">
      {items.map((item,i) => (
        <div
          key={i}
          className={`px-[5px] py-[3px] rounded-t-lg w-full flex justify-center ${
            tabActive.name == item.name && `bg-dark-400`
          }`}
          onClick={() => handleChangeTab(item)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

export function TabMenuItem({ task }) {
  return (
    <div className="mt-2 flex items-center justify-between relative">
      <span className="font-extralight text-dark-100">{task.startTime.slice(0,-3)}</span>
      <div className="w-[85%] flex items-center">
        <div className="w-[10px] h-[1px] bg-dark-100 opacity-50"></div>
        <div className="font-semibold text-sm w-full text-center bg-violet-main  rounded-full py-2">
          {task.title}{" "}
        </div>
        <div className="w-[10px] h-[1px] bg-dark-100 opacity-50"></div>
      </div>
    </div>
  );
}
