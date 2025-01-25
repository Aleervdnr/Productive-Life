import axios from "./axios";

export const getExpensesRequest = (token) =>
    axios.get("/expenses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  export const getExpenseRequest = (id) => axios.get(`/expenses/${id}`);
  export const createExpenseRequest = (expense, token) =>
    axios.post("/expenses", expense, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  export const updateExpenseRequest = (expense, token) =>
    axios.put(`/expenses/${expense._id}`, expense, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  export const deleteExpenseRequest = (id, token) =>
    axios.delete(`/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });