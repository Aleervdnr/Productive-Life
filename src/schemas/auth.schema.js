import { z } from "zod";

export const registerSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  email: z
    .string({
      required_error: "Por favor, no olvides ingresar tu correo.",
    })
    .email({
      message: "Correo no válido. Inténtalo nuevamente.",
    }),
  password: z
    .string({
      required_error: "Por favor, no olvides ingresar tu contraseña.",
    })
    .min(6, {
      message: "Asegúrate de que la contraseña tenga 6 caracteres o más.",
    }),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Por favor, no olvides ingresar tu correo.",
    })
    .email({
      message: "Correo no válido. Inténtalo nuevamente.",
    }),
  password: z
    .string({
      required_error: "Por favor, no olvides ingresar tu contraseña.",
    })
    .min(6, {
      message: "Asegúrate de que la contraseña tenga 6 caracteres o más.",
    }),
});