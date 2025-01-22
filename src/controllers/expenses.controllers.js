import Expense from '../models/expense.model.js';

// Crear un gasto
export const createExpense = async (req, res) => {
  try {
    const { title, description, amount, date, category, type, user } = req.body;

    const expense = new Expense({ title, description, amount, date, category, type, user });
    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error creando el gasto', error });
  }
};

// Obtener todos los gastos
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo los gastos', error });
  }
};

// Actualizar un gasto
export const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExpense) return res.status(404).json({ message: 'Gasto no encontrado' });

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando el gasto', error });
  }
};

// Eliminar un gasto
export const deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) return res.status(404).json({ message: 'Gasto no encontrado' });

    res.status(200).json({ message: 'Gasto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando el gasto', error });
  }
};
