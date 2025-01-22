import { Router } from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from '../controllers/expenses.controllers.js';
import { validateSchema } from "../middlewares/validateSchema.js";
import { authRequired } from "../middlewares/validateToken.js";
import { expenseSchema } from "../schemas/expense.schema.js";


const router = Router();

router.post('/expenses', authRequired,validateSchema(expenseSchema), createExpense);
router.get('/expenses', authRequired, getExpenses);
router.put('/expenses/:id', authRequired, updateExpense);
router.delete('/expenses/:id', authRequired, deleteExpense);

export default router;
