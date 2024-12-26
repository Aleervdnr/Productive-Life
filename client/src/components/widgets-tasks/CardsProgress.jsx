import { useRef } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { AnimatedCounter } from "../AnimatedCounter";

export default function CardsProgress({
  filteredTasks,
  tasks,
  title,
  setDropDownState,
}) {
  const detailsRef = useRef(null);

  const handleSelect = (e) => {
    setDropDownState(e.target.innerText);
    detailsRef.current.removeAttribute("open");
  };

  return (
    <div id="step-2" className="max-lg:hidden w-full grid grid-cols-4 gap-2 row-start-2 col-start-2 col-end-5">
      <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
        <span className="text-xs">Tareas Completadas</span>
        <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
          {filteredTasks.filter((task) => task.status == "completed").length}{" "}
          <span className="lg:text-sm xl:text-lg">de</span>{" "}
          {filteredTasks.length}
        </span>
      </div>
      <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
        <span className="text-xs">Tareas Para Hacer</span>
        <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
          {filteredTasks.filter((task) => task.status == "pending").length}{" "}
          <span className="lg:text-sm xl:text-lg">de</span>{" "}
          {filteredTasks.length}
        </span>
      </div>
      <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
        <span className="text-xs">Tareas Atrasadas</span>
        <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7">
          {filteredTasks.filter((task) => task.status == "overdue").length}{" "}
          <span className="lg:text-sm xl:text-lg">de</span> {filteredTasks.length}
        </span>
      </div>
      <div className="py-2 px-2 w-full border-[2px] border-dark-400 grid place-content-center rounded-lg">
        <details className="text-xs relative" ref={detailsRef}>
          <summary className="list-none px-3 flex items-center cursor-pointer">
            {title}
            <RiArrowDownSLine className="absolute right-4 text-lg text-violet-main" />
            <div className="px-3"></div>
          </summary>
          <ul className="absolute bg-dark-200 w-full">
            <li
              className="cursor-pointer hover:bg-dark-400 px-3 py-2"
              onClick={(e) => handleSelect(e)}
            >
              Progreso Mensual
            </li>
            <li
              className="cursor-pointer hover:bg-dark-400 px-3 py-2"
              onClick={(e) => handleSelect(e)}
            >
              Progreso Semanal
            </li>
            <li
              className="cursor-pointer hover:bg-dark-400 px-3 py-2"
              onClick={(e) => handleSelect(e)}
            >
              Progreso Diario
            </li>
          </ul>
        </details>
        <span className="lg:text-[1.125rem] xl:text-[1.375rem] font-bold leading-7 px-3">
          <AnimatedCounter value={Math.round(
            (filteredTasks.filter((task) => task.status == "completed").length /
              filteredTasks.length) *
              100
          )} duration={200} />
          {/* {Math.round(
            (filteredTasks.filter((task) => task.status == "completed").length /
              filteredTasks.length) *
              100
          )} */}
          
        </span>
      </div>
    </div>
  );
}
