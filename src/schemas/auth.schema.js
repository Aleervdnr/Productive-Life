import { z } from "zod";

export const registerSchema = z.object({
  name: z.string({
    required_error: "NAME_REQUIRED",
  }),
  email: z
    .string({
      required_error: "EMAIL_REQUIRED",
    })
    .email({
      message: "EMAIL_INVALID",
    }),
  password: z
    .string({
      required_error: "PASSWORD_REQUIRED",
    })
    .min(6, {
      message: "PASSWORD_TOO_SHORT",
    }),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "EMAIL_REQUIRED",
    })
    .email({
      message: "EMAIL_INVALID",
    }),
  password: z
    .string({
      required_error: "PASSWORD_REQUIRED",
    })
    .min(6, {
      message: "PASSWORD_TOO_SHORT",
    }),
});
