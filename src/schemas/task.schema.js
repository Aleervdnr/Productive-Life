import { z } from "zod";

const recurrenceTaskSchema = z.object({
  taskDate: z.string().nonempty(), // Fecha de la recurrencia, requerida y no vacía
  startTime: z.string().optional(), // Horas de inicio opcionales
  endTime: z.string().optional(), // Horas de fin opcionales
});

export const taskSchema = z.object({
  title: z.string({
    required_error: "title is required",
  }),
  description: z.string(),
  taskDate: z.string().date({ message: "fecha invalida" }),
  startTime: z.string().time({ message: "Hora invalida" }),
  endTime: z.string().time({ message: "Hora invalida" }).optional(),
  isRecurring: z.boolean().optional(),
  recurringDays: z.string().array({ message: "array invalida" }).optional(),
  recurringEndDate: z.string().date({ message: "fecha invalida" }).optional(),
  recurrenceTasks:z.array(recurrenceTaskSchema).optional(), // Validación del array de tareas de recurrencia
});
