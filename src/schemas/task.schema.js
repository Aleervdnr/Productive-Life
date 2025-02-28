import { z } from "zod";

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
  recurrences:z.array(z.object({
    taskDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
    description: z.string(),
    startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Formato de hora inválido (HH:mm:ss)"),
    endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Formato de hora inválido (HH:mm:ss)")
  })).optional()
});
