import axios from "./axios";

export const getTasksRequest = (token) =>
  axios.get("/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getTaskRequest = (id) => axios.get(`/tasks/${id}`);

export const createTaskRequest = (task, token) =>
  axios.post(
    "/tasks",
    task, // Este es el cuerpo de la solicitud
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

export const updateTasksRequest = (task, token) =>
  axios.put(`/tasks/${task._id}`, task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
export const deleteTasksRequest = (id, token) =>
  axios.delete(`/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
