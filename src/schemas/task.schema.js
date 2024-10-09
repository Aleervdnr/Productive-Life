import { z } from "zod";

export const taskSchema = z.object({
  title: z.string({
    required_error: "title is required",
  }),
  description: z.string({
    required_error: "description is required",
  }),
  taskDate: z.string().date({ message: "fecha invalida" }),
  startTime: z.string().time({ message: "Hora invalida" }),
  endTime: z.string().time({ message: "Hora invalida" }).optional(),
  isRecurring: z.boolean().optional(),
  recurringDays: z.string().array({ message: "array invalida" }).optional(),
  recurringEndDate: z.string().date({ message: "fecha invalida" }).optional(),
});
