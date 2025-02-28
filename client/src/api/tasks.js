import axios from "./axios";

export const getTasksRequest = (token) =>
  axios.get("/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const getTaskRequest = (id, token) =>
  axios.get(`/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const createTaskRequest = (task, token) =>
  axios.post("/tasks", task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
