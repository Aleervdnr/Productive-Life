import { z } from "zod";

export const feedbackPostSchema = z.object({
  title: z
    .string({
      required_error: "feedback.title_required",
    })
    .min(3, { message: "feedback.title_min_length" }),

  description: z
    .string({
      required_error: "feedback.description_required",
    })
    .min(10, { message: "feedback.description_min_length" }),

  urgency: z.enum(["low", "medium", "high"], {
    required_error: "feedback.urgency_required",
    invalid_type_error: "feedback.urgency_invalid",
  }),
});
