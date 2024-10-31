import { createContext, useContext, useEffect, useState } from "react";
import {
  createTaskRequest,
  deleteTasksRequest,
  getTasksRequest,
  updateTasksRequest,
} from "../api/tasks";
import { startOfWeek, endOfWeek, isWithinInterval, addDays, format, isBefore, parseISO } from "date-fns";
import { toast } from "sonner";

const TasksContext = createContext();

export const useTasks = () => {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("useTasks debe ser usado dentro de TasksProvider");
  }

  return context;
};

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [recurrentTasks, setRecurrentTasks] = useState([]);
  const [tasksIsLoading, setTasksIsLoading] = useState(true);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);

  useEffect(() => {
    getTasks()
    setTasksIsLoading(false)
  }, [])
  

  // Filtrar tareas del día actual
  const filterDailyTasks = () => {
    const today = new Date();
    console.log(today);
    console.log(tasks);

    const filteredTasks = tasks.map((task) => {
      console.log(task.taskDate);
    });

    setDailyTasks(filteredTasks);
  };

  //Crear tareas
  const createTask = async (task) => {
    try {
      const session = { token: localStorage.getItem("token") };
      const res = await createTaskRequest(task, session.token);
      setTasks([...tasks, res.data]);
      toast.success("Tarea creada con exito");
      console.log(res);
    } catch (err) {
      toast.error("Ocurrio un error");
      console.log(err);
    }
  };

  function generateRecurrences(taskDate, taskEndDate,recurringDays,startTime,endTime) {

    const start = parseISO(taskDate);
    const end = parseISO(taskEndDate);
    const recurrenceDates = [];
  
    // Iniciamos desde la fecha de inicio
    let currentDate = start;
  
    // Iterar hasta alcanzar o superar la fecha de fin
    while (isBefore(currentDate, end) || currentDate.getTime() === end.getTime()) {
      const dayOfWeek = currentDate.getDay(); // Obtener el día de la semana
      // Si el día actual está en los días de recurrencia, lo agregamos al array
      if (recurringDays.includes(dayOfWeek.toString())) {
        recurrenceDates.push({
          taskDate: format(currentDate, "yyyy-MM-dd"),
          startTime: startTime,
          endTime: endTime
        });
      }
      console.log(recurrenceDates)
  
      // Avanzar al siguiente día
      currentDate = addDays(currentDate, 1);
    }
    return recurrenceDates;
  }

  //Obtener tareas
  const getTasks = async () => {
    const session = { token: localStorage.getItem("token") };
    const res = await getTasksRequest(session.token);
    setTasks(res.data);
  };

  //Actualizar tareas
  const updateTask = async (task, isStatus) => {
    try {
      const session = { token: localStorage.getItem("token") };
      await updateTasksRequest(task, session.token);
      setTasks(
        tasks.map((TaskMap) => (TaskMap._id == task._id ? task : TaskMap))
      );
      if (!isStatus) toast.success("Tarea actualizada con exito");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const session = { token: localStorage.getItem("token") };
      await deleteTasksRequest(id, session.token);
      setTasks(tasks.filter((taskMap) => taskMap._id !== id));
      toast.warning("Tarea Eliminada");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckRecurringDays = (data, set, array) => {
    const newArray = array.map((item) =>
      item.isoDay == data
        ? { name: item.name, isoDay: item.isoDay, status: !item.status }
        : item
    );
    set(newArray);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        createTask,
        getTasks,
        updateTask,
        deleteTask,
        weeklyTasks,
        setWeeklyTasks,
        tasksIsLoading,
        setTasksIsLoading,
        handleCheckRecurringDays,
        filterDailyTasks,
        setRecurrentTasks,
        generateRecurrences
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
