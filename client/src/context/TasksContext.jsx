import { createContext, useContext, useEffect, useState } from "react";
import {
  createTaskRequest,
  getTasksRequest,
  updateTasksRequest,
} from "../api/tasks";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
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
  const [tasksIsLoading, setTasksIsLoading] = useState(true);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);

  // Filtrar tareas del día actual
  const filterDailyTasks = () => {
    const today = new Date();

    const filteredTasks = tasks.filter((task) => {
      const taskDate = new Date(task.taskDate);
      return isSameDay(taskDate, today);
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
      console.log(res)
    }catch(err){
      toast.error("Ocurrio un error")
      console.log(err);
    }

  };

  //Obtener tareas
  const getTasks = async () => {
    const session = { token: localStorage.getItem("token") };
    const res = await getTasksRequest(session.token);
    setTasks(res.data);
  };

  //Actualizar tareas
  const updateTask = async (task) => {
    try {
      const session = { token: localStorage.getItem("token") };
      await updateTasksRequest(task, session.token);
      setTasks(
        tasks.map((TaskMap) => (TaskMap._id == task._id ? task : TaskMap))
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        createTask,
        getTasks,
        updateTask,
        weeklyTasks,
        setWeeklyTasks,
        tasksIsLoading,
        setTasksIsLoading,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
