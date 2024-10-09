import { z } from "zod";

export const registerSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  email: z
    .string({
      required_error: "email is required",
    })
    .email({
      message: "invalid email",
    }),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(6, {
      message: "password must be a least 6 characters",
    }),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email({
      message: "invalid email",
    }),
  password: z
    .string({
      required_error: "Password is requerida",
    })
    .min(6, {
      message: "password must be a least 6 characters",
    }),
});