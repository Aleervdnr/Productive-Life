import { z } from "zod";

export const expenseSchema = z.object({
  title: z
    .string({
      required_error: "El título es obligatorio",
    })
    .min(1, "El título no puede estar vacío")
    .max(100, "El título no puede tener más de 100 caracteres"),

  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional(),

  amount: z
    .number({
      required_error: "El monto es obligatorio",
      invalid_type_error: "El monto debe ser un número",
    })
    .min(0, "El monto debe ser mayor o igual a 0"),

  date: z.string().date({ message: "fecha invalida" }),

  category: z.string({
    required_error: "La categoria es obligatoria",
  }),

  type: z.enum(["Expense","Fixed Expense", "Income"], {
    required_error: "El tipo es obligatorio",
  }),
});
