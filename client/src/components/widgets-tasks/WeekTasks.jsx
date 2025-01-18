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
import ItemTodayTask from "./ItemTodayTask";

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

  const { width } = useWindowSize();

  const [motivationalMessage, setMotivationalMessage] = useState("");

  useEffect(() => {
    const messages = [
      "¡Hoy está en blanco! 🎨 ¿Qué te gustaría lograr hoy? Agrega una tarea y comienza a avanzar.",
      "¡Es un buen día para empezar algo nuevo! 🌱 Añade una tarea y alcanza tus metas.",
      "Sin tareas por aquí... ¿Listo para hacer del día algo productivo? ✨ Planifica tu siguiente paso.",
      "Nada en la lista por ahora, ¡pero hoy puede ser un gran día! 🌞 ¿Qué te gustaría conseguir?",
      "Tu día está esperando... 📝 ¿Qué tal si le damos un propósito? ¡Agrega tu primera tarea!",
      "¡Todo despejado por aquí! Pero recuerda: las grandes metas se logran paso a paso. ¿Qué harás hoy?",
      "Parece que no tienes nada por hacer… ¡Es la oportunidad perfecta para iniciar algo nuevo! 🎉",
      "Un día sin tareas, ¿quizá quieras cambiar eso? Añade una actividad y alcanza algo importante.",
    ];

    // Generar un índice aleatorio
    const randomIndex = Math.floor(Math.random() * messages.length);

    // Guardar el mensaje aleatorio en el estado
    setMotivationalMessage(messages[randomIndex]);
  }, []); // Solo se ejecuta una vez al montar el componente

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
  }, [tasks,tabActive]);

  useEffect(() => {
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }); // La semana comienza en lunes

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const currentDay = addDays(startOfCurrentWeek, i); // Sumar días desde el inicio de la semana
      const dayNames = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ];

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
    console.log(name)
    setTabActive(name)
  };
  return (
    <div
      id={width >= 1024 ? "step-3" : null}
      className="w-[100vw] h-[calc(100vh-97px)] max-lg:relative px-5 max-lg:py-3 lg:row-start-3 lg:col-span-4 lg:bg-dark-400 lg:w-full lg:h-full lg:pb-3"
    >
      <div className="lg:grid lg:w-full lg:grid-cols-3 lg:justify-items-center lg:content-center lg:py-1">
        <h2 className="text-center hidden lg:block font-medium text-2xl my-2 lg:col-start-2">
          Mi Semana
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
        className={`${width > 1024 &&
          "hidden"} ${
          tasksIsLoading
            ? "flex flex-col gap-2"
            : `${
                currentTabTasks.length > 0
                  ? "flex flex-col gap-2"
                  : " w-full h-[calc(100%-32px)] grid place-content-center"
              }`
        } mt-3`}
      >
        {tasksIsLoading ? (
          <>
            <div className="w-full h-[68px] rounded-xl bg-dark-400 animate-pulse"></div>
            <div className="w-full h-[68px] rounded-xl bg-dark-400 animate-pulse"></div>
            <div className="w-full h-[68px] rounded-xl bg-dark-400 animate-pulse"></div>
          </>
        ) : currentTabTasks.length ? (
          currentTabTasks.map((task) => (
            <ItemTodayTask task={task} key={task._id} />
          ))
        ) : (
          <p className="text-sm text-center">{motivationalMessage}</p>
        )}
      </div>
    </div>
  );
}
