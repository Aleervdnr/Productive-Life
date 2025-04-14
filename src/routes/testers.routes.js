import express from "express";
const router = express.Router();
import {
  createFeedbackPost,
  getMyFeedbackPosts,
  getAllFeedbackPosts,
  updatePostStatus,
  getFeedbackPostById,
  addFeedbackComment,
  updateFeedbackPost,
  deleteFeedbackPost,
  deleteFeedbackComment,
} from "../controllers/testerFeedback.controllers.js";
import upload from "../middlewares/upload.js";

import { isTester, isAdmin } from "../middlewares/roleUserValidation.js";
import { authRequired } from "../middlewares/validateToken.js";
import rateLimit from "express-rate-limit";
import { validateSchema } from "../middlewares/validateSchema.js";
import { feedbackPostSchema } from "../schemas/feedbackPost.schema.js";

// Limite moderado para feedback (crear post o comentar)
const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { code: "too_many_feedback_requests" },
});

// Crear nuevo post
router.post(
  "/tester-feedback",
  authRequired,
  isTester,
  feedbackLimiter,
  upload.array("media", 5),
  validateSchema(feedbackPostSchema),
  createFeedbackPost
);
// Obtener mis posts
router.get("/tester-feedback/mine", authRequired, isTester, getMyFeedbackPosts);

// Obtener todos los posts (admin)
router.get("/tester-feedback", authRequired, isAdmin, getAllFeedbackPosts);

// Cambiar estado de un post
router.patch(
  "/tester-feedback/:id/status",
  authRequired,
  isAdmin,
  updatePostStatus
);

// Obtener post específico
router.get("/tester-feedback/:id", authRequired, getFeedbackPostById);

// Agregar comentario
router.post(
  "/tester-feedback/:id/comment",
  authRequired,
  isTester,
  feedbackLimiter,
  addFeedbackComment
);

// Actualizar post
router.put("/tester-feedback/:id", authRequired, isTester, updateFeedbackPost);

// Eliminar post
router.delete(
  "/tester-feedback/:id",
  authRequired,
  isTester,
  deleteFeedbackPost
);

// Eliminar comentario
router.delete(
  "/tester-feedback/:postId/comments/:commentId",
  authRequired,
  deleteFeedbackComment
);

export default router;
