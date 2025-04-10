import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // o como se llame tu modelo de usuarios
      required: true,
    },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // Para no generar un _id por cada comentario si no lo necesitás
);

const testerPostSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    urgency: {
      type: String,
      enum: ["Baja", "Media", "Alta"],
      default: "Media",
    },
    status: {
      type: String,
      enum: ["Enviado", "En Revisión", "Solucionado"],
      default: "Enviado",
    },
    media: [{ type: String }], // URLs de imágenes o videos
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TesterPost", testerPostSchema);
