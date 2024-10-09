import { Router } from "express";
import { login, register, verifyToken } from "../controllers/auth.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router()

router.post("/register",validateSchema(registerSchema), register)
router.post("/login",validateSchema(loginSchema), login)
router.get("/verify", verifyToken)

export default router