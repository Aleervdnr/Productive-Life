import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/tasks.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { taskSchema } from "../schemas/task.schema.js";

const router = Router();

router.get("/tasks", authRequired, getTasks);
router.post("/tasks", authRequired,validateSchema(taskSchema), createTask)
router.delete("/tasks/:id", authRequired, deleteTask)
router.put("/tasks/:id", authRequired, updateTask)

export default router;
