import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startTime: {
      type: String,
      // required: true,
    },
    endTime: {
      type: String,
      // required: true,
    },
    taskDate: {
      type: String,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "overdue"],
      default: "pending",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringDays: {
      type: [Number], // Array de números (0 para domingo, 1 para lunes, etc.)
      validate: {
        validator: function (v) {
          return v.every((day) => day >= 0 && day <= 6);
        },
        message: "Días deben ser un array con valores entre 0 y 6.",
      },
    },
    recurringEndDate: {
      type: String, // Fecha hasta la cual la tarea se seguirá repitiendo
    },
    recurrences: {
      type: [
        {
          taskDate: { type: String, required: true },
          description: {
            type: String,
          },
          startTime: String,
          endTime: String,
          status: { type: String, enum: ["completed", "pending", "overdue"], default: "pending" },
          recurrenceOf: {
            type: String,
          },
          id: {
            type: String,
          },
        }
      ],
      default: [], // Asegura que el array se inicialice vacío si no se proporcionan datos
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ taskDate: 1, startTime: 1 });

export default mongoose.model("Task", taskSchema);
