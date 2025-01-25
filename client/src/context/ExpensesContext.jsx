import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getExpensesRequest,
  createExpenseRequest,
  updateExpenseRequest,
  deleteExpenseRequest,
} from "../api/expenses"; // Asegúrate de tener estas funciones definidas
import { toast } from "sonner"; // Puedes usar cualquier librería de notificaciones

const ExpensesContext = createContext();

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses debe ser usado dentro de un ExpensesProvider");
  }
  return context;
};

export const ExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [fixedExpenses, setFixedExpenses] = useState(0)
  const [incomes, setIncomes] = useState(0)
  const [isLoading, setIsLoading] = useState(false);

  // Obtener gastos
  const getExpenses = async () => {
    try {
      setIsLoading(true);
      const session = { token: localStorage.getItem("token") };
      const response = await getExpensesRequest(session.token);
      setExpenses(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error obteniendo gastos:", error);
      toast.error("No se pudieron cargar los gastos");
      setIsLoading(false);
    }
  };

  // Crear un gasto
  const createExpense = async (expense) => {
    try {
      const session = { token: localStorage.getItem("token") };
      const response = await createExpenseRequest(expense,session.token);
      console.log(response.data)
      setExpenses([...expenses, response.data]);
      toast.success("Gasto creado con éxito");
    } catch (error) {
      console.error("Error creando gasto:", error);
      toast.error("No se pudo crear el gasto");
    }
  };

  // Actualizar un gasto
  const updateExpense = async (id, updatedData) => {
    try {
      const response = await updateExpenseRequest(id, updatedData);
      setExpenses(
        expenses.map((expense) =>
          expense._id === id ? { ...expense, ...response.data } : expense
        )
      );
      toast.success("Gasto actualizado con éxito");
    } catch (error) {
      console.error("Error actualizando gasto:", error);
      toast.error("No se pudo actualizar el gasto");
    }
  };

  // Eliminar un gasto
  const deleteExpense = async (id) => {
    try {
      await deleteExpenseRequest(id);
      setExpenses(expenses.filter((expense) => expense._id !== id));
      toast.warning("Gasto eliminado con éxito");
    } catch (error) {
      console.error("Error eliminando gasto:", error);
      toast.error("No se pudo eliminar el gasto");
    }
  };

  const calculateTotalByType = (expenses, type) => {
    if (!Array.isArray(expenses)) {
      throw new Error("El parámetro 'expenses' debe ser un array.");
    }
  
    if (typeof type !== "string") {
      throw new Error("El parámetro 'type' debe ser un string.");
    }
  
    // Filtra los gastos según el tipo y suma sus montos
    const total = expenses
      .filter((expense) => expense.type === type)
      .reduce((sum, expense) => sum + expense.amount, 0);
  
    return total;
  };

  useEffect(() => {
    getExpenses();
  }, []);

  useEffect(() => {
    setIncomes(calculateTotalByType(expenses,"Income"))
    setFixedExpenses(calculateTotalByType(expenses,"Fixed Expense"))
    setTotalExpenses(calculateTotalByType(expenses,"Expense")+ calculateTotalByType(expenses,"Fixed Expense"))
  }, [expenses])
  

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        incomes,
        fixedExpenses,
        totalExpenses,
        isLoading,
        getExpenses,
        createExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};
