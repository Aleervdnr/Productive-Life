import { createContext, useContext, useEffect, useState } from "react";
import {
  createTaskRequest,
  deleteTasksRequest,
  getTaskRequest,
  getTasksRequest,
  updateTasksRequest,
} from "../api/tasks";
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
  const [parentTasks, setParentTasks] = useState([]);
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
        setParentTasks([...parentTasks, res.data]);
      } else {
        setTasks([...tasks, res.data]);
      }
    } catch (err) {
      toast.error("Ocurrio un error");
      console.log(err);
    }
  };

  const getTask = async (id) => {
    try {
      const session = { token: localStorage.getItem("token") };
      const res = await getTaskRequest(id, session.token);
      return res.data;
    } catch (error) {
      console.error("Error obteniendo tarea:", error);
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

      const filteredSingleTasks = res.data.filter((task) => !task.isRecurring);

      setTasks([...filteredSingleTasks, ...recurrences]);
      setParentTasks(filteredRecurringTasks);
      if (res.status == 200) setTasksIsLoading(false);
      return res;
    } catch (error) {
      console.error("Error obteniendo tareas:", error);
    }
  };

  //Actualizar tareas
  const updateTask = async (
    task,
    isStatus = false,
    isRecurrenceDeleted = false
  ) => {
    try {
      const session = { token: localStorage.getItem("token") };
      const res = await updateTasksRequest(task, session.token);
      console.log(res.data, task);

      if (res.data.isRecurring) {
        const recurrences = [];
        res.data.recurrences.forEach((task) =>
          recurrences.push({
            title: res.data.title,
            description: task.description ? task.description : "",
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
          tasks
            .map((TaskMap) => (TaskMap._id == task._id ? res.data : TaskMap))
            .filter((taskMap) => taskMap.recurrenceOf != task._id)
        );
      }
      if (!isStatus & !isRecurrenceDeleted)
        toast.success("Tarea actualizada con exito");
      if (isRecurrenceDeleted) toast.warning("Recurrencia Eliminada");
      return res;
    } catch (error) {
      console.log(error);
      toast.error("Ocurrio un error");
    }
  };

  const deleteTask = async (id) => {
    try {
      const session = { token: localStorage.getItem("token") };
      const res = await deleteTasksRequest(id, session.token);
      setTasks(tasks.filter((taskMap) => taskMap._id !== id));
      toast.warning("Tarea Eliminada");
      return res;
    } catch (err) {
      console.log(err);
      toast.error("Ocurrio un error");
    }
  };

  const handleCheckRecurringDays = (data, set, array) => {
    const newArray = array.map((item) =>
      item.isoDay == data
        ? { name: item.name, isoDay: item.isoDay, status: !item.status }
        : item
    );
    set(newArray);
    return newArray;
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        setTasks,
        parentTasks,
        setParentTasks,
        createTask,
        getTasks,
        getTask,
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
