import "dotenv/config.js";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import cors from "cors";
import { FRONTEND_URL } from "./config.js";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", tasksRoutes);

export default app;
