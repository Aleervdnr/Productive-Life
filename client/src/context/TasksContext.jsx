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

      if (res.data.isRecurring) {
        const recurrences = [];
        res.data.recurrences.forEach((task) =>
          recurrences.push({
            title: res.data.title,
            description: res.data.description,
            recurringDays: res.data.recurringDays,
            taskDate: task.taskDate,
            recurringEndDate: res.data.recurringEndDate,
            startTime: task.startTime,
            endTime: task.endTime,
            status: task.status,
            recurrenceOf: res.data._id,
            _id: task._id,
          })
        );
        setTasks((prevTasks) => [...prevTasks, ...recurrences]);
      }
    } catch (err) {
      toast.error("Ocurrio un error");
      console.log(err);
    }
  };

  //Obtener tareas
  const getTasks = async () => {
    try {
      const session = { token: localStorage.getItem("token") };
      const res = await getTasksRequest(session.token);

      const filteredRecurringTasks = res.data.filter(
        (task) => task.isRecurring === true
      );
      const recurrences = [];

      // Iterar solo hasta el último índice del array
      for (let i = 0; i < filteredRecurringTasks.length; i++) {
        if (filteredRecurringTasks[i].recurrences) {
          // Verificar que 'recurrences' exista
          filteredRecurringTasks[i].recurrences.forEach((task) =>
            recurrences.push({
              title: filteredRecurringTasks[i].title,
              description: filteredRecurringTasks[i].description,
              recurringDays: filteredRecurringTasks[i].recurringDays,
              taskDate: task.taskDate,
              recurringEndDate: filteredRecurringTasks[i].recurringEndDate,
              startTime: task.startTime,
              endTime: task.endTime,
              status: task.status,
              recurrenceOf: filteredRecurringTasks[i]._id,
              _id: task._id,
            })
          );
        }
      }

      setTasks([...res.data, ...recurrences]);
    } catch (error) {
      console.error("Error obteniendo tareas:", error);
    }
  };

  //Actualizar tareas
  const updateTask = async (task, isStatus, isRecurrenceDeleted) => {
    try {
      const session = { token: localStorage.getItem("token") };
      const res = await updateTasksRequest(task, session.token);
      console.log(res.data, task);

      if (res.data.isRecurring) {
        const recurrences = [];
        res.data.recurrences.forEach((task) =>
          recurrences.push({
            title: res.data.title,
            description: res.data.description,
            recurringDays: res.data.recurringDays,
            taskDate: task.taskDate,
            recurringEndDate: res.data.recurringEndDate,
            startTime: task.startTime,
            endTime: task.endTime,
            status: task.status,
            recurrenceOf: res.data._id,
            _id: task._id,
          })
        );
        const mapTasks = tasks.map((TaskMap) =>
          TaskMap._id == task._id ? res.data : TaskMap
        );
        console.log(mapTasks);
        const deletedOldRecurrencesTasks = mapTasks.filter(
          (task) => task.recurrenceOf != res.data._id
        );
        console.log(deletedOldRecurrencesTasks);
        console.log(deletedOldRecurrencesTasks, recurrences);
        setTasks([...deletedOldRecurrencesTasks, ...recurrences]);
      } else {
        setTasks(
          tasks.map((TaskMap) => (TaskMap._id == task._id ? res.data : TaskMap))
        );
      }
      if (!isStatus & !isRecurrenceDeleted)
        toast.success("Tarea actualizada con exito");
      if (isRecurrenceDeleted) toast.warning("Recurrencia Eliminada");
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
        setTasks,
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
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
