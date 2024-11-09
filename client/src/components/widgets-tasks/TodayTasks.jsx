import { useTasks } from "../../context/TasksContext";
import ItemTodayTask from "./ItemTodayTask";
import { todayDate } from "../../libs/Dates.js";
import { useEffect } from "react";

export default function TodayTasks() {
  const { tasks } = useTasks();

  useEffect(() => {
    console.log(
      tasks.map((task) =>
        console.log(new Date(`${task.taskDate}T${task.startTime}`), new Date())
      )
    );
  }, []);

  function getMotivationalMessage() {
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

    // Retornar el mensaje seleccionado
    return messages[randomIndex];
  }

  const filteredTasks = tasks
    .filter((task) => task.taskDate == todayDate)
    .sort((a, b) => {
      // Convertir el tiempo de "HH:mm:ss" a un timestamp para ordenarlos
      const timeA = new Date(`1970-01-01T${a.startTime}`).getTime();
      const timeB = new Date(`1970-01-01T${b.startTime}`).getTime();
      return timeA - timeB; // Orden ascendente
    });

  return (
    <div className="max-lg:w-[100vw] max-lg:h-[calc(100dvh-85px)] px-5 lg:w-full lg:row-start-1 lg:row-end-3 lg:border-[2px] lg:border-dark-400 lg:rounded-lg lg:p-3 overflow-scroll">
      <span className="text-lg font-semibold">Tareas del dia</span>
      <div
        className={`${
          tasks.filter((task) => task.taskDate == todayDate).length
            ? "flex flex-col gap-2"
            : " w-full h-[calc(100%-32px)] grid place-content-center"
        }  mt-2`}
      >
        {filteredTasks.length ? (
          filteredTasks.map((task) => (
            <ItemTodayTask task={task} key={task._id} />
          ))
        ) : (
          <p className="text-sm text-center">{getMotivationalMessage()}</p>
        )}
      </div>
    </div>
  );
}
