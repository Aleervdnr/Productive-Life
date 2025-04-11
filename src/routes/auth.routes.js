import { Router } from "express";
import {
  login,
  register,
  reSendEmailVerification,
  tourCompleted,
  verifyEmailToken,
  verifyToken,
} from "../controllers/auth.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import rateLimit from "express-rate-limit";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Solo 5 intentos permitidos
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: "too_many_login_attempts" },
});

// Rate limit moderado para registro y reenvío de email
const moderateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { code: "too_many_requests" },
});

router.post("/register", moderateLimiter, validateSchema(registerSchema), register);
router.post("/login", loginLimiter, validateSchema(loginSchema), login);
router.get("/verify-token", verifyToken);
router.get("/verify-email-token", verifyEmailToken);
router.post("/resend-email-verify", moderateLimiter, reSendEmailVerification);
router.patch("/tour-completed", tourCompleted);

export default router;
