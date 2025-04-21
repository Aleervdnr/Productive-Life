import { format, getDate, setDefaultOptions } from "date-fns";
import { useTasks } from "../../context/TasksContext";
import { es, enUS } from "date-fns/locale";
import ItemTask from "../ItemTask/ItemTask";
import Modal from "../Modal";

setDefaultOptions({ locale: es });

export default function MonthDayItem({ children, day }) {
  const { tasks, tasksIsLoading } = useTasks();

  const filteredTasks = tasks
    .filter((task) => task.taskDate == format(new Date(day), "yyyy-MM-dd"))
    .sort((a, b) => {
      // Convertir el tiempo de "HH:mm:ss" a un timestamp para ordenarlos
      const timeA = new Date(`1970-01-01T${a.startTime}`).getTime();
      const timeB = new Date(`1970-01-01T${b.startTime}`).getTime();
      return timeA - timeB; // Orden ascendente
    });
  const completedTasks = filteredTasks.filter(
    (task) => task.status == "completed"
  );

  const formatDate = (date, language) => {
    const locale = language === "es" ? es : enUS; // Selecciona el locale según el idioma
    const formatPattern =
      language === "es"
        ? "d 'de' MMMM" // Formato para español: "2 de abril"
        : "MMMM d"; // Formato para inglés: "April 2"

    return format(date, formatPattern, { locale });
  };

  return (
    <>
      <button
        className="w-full h-full rounded-full flex items-center justify-center text-sm lg:text-xs transition-colors ease-in"
        style={{
          background: `conic-gradient(#7e73ff ${
            filteredTasks.length > 0
              ? (completedTasks.length / filteredTasks.length) * 100
              : 0
          }%, 0, #9B9BA5 66%)`,
        }}
        onClick={() =>
          document
            .getElementById(`modal_month_${getDate(new Date(day))}`)
            .showModal()
        }
      >
        <div className="h-[80%] w-[80%] rounded-full bg-dark-500 flex items-center justify-center">
          {children}
        </div>
      </button>
      <Modal
        id={`modal_month_${getDate(new Date(day))}`}
        title={formatDate(new Date(day))}
      >
        <div className=" grid gap-2 px-4 pb-4">
          {!tasksIsLoading &&
            filteredTasks.map((task) => (
              <ItemTask key={task._id} task={task} />
            ))}
        </div>
      </Modal>
    </>
  );
}

{
  /* <p className="py-4">Press ESC key or click on ✕ button to close</p> */
}
