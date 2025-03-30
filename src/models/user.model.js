import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Ya no es obligatorio
    },
    googleId: {
      type: String,
      unique: true, // Asegura que el ID de Google sea único
      sparse: true, // Permite valores nulos
    },
    provider: {
      type: String,
      enum: ["email", "google"], // Solo permitir estos valores
      default: "email", // Valor predeterminado para usuarios tradicionales
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    tourCompleted: {
      taskTour: { type: Boolean, default: false },
      gastosTour: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Transformación para eliminar campos sensibles del objeto JSON
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.password; // No exponer la contraseña
    delete returnedObject.googleId; // No exponer el ID de Google
  },
});

export default mongoose.model("User", userSchema);