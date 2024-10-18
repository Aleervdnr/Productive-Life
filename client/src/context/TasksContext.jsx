import { createContext, useContext, useEffect, useState } from "react";
import {
  createTaskRequest,
  deleteTasksRequest,
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
      console.log(res);
    } catch (err) {
      toast.error("Ocurrio un error");
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
  const updateTask = async (task, isStatus) => {
    try {
      const session = { token: localStorage.getItem("token") };
      await updateTasksRequest(task, session.token);
      setTasks(
        tasks.map((TaskMap) => (TaskMap._id == task._id ? task : TaskMap))
      );
      if(!isStatus) toast.success("Tarea actualizada con exito");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try{
      const session = {token: localStorage.getItem("token")}
      await deleteTasksRequest(id,session.token)
      setTasks(tasks.filter(taskMap => (taskMap._id !== id)))
    }catch(err){
      console.log(err)
    }
  }

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
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
