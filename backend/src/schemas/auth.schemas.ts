import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, {
    message: "A senha deve ter no mínimo 8 caracteres",
  })
  .max(30, {
    message: "A senha não deve ter mais que 30 caracteres",
  })
  .refine((value) => /[A-Z]/.test(value), {
    message: "A senha deve conter pelo menos uma letra maiúscula",
  })
  .refine((value) => /\d/.test(value), {
    message: "A senha deve conter pelo menos um número",
  });

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, {
        message: "O nome deve ter no mínimo 3 caracteres",
      }),

    email: z
      .string()
      .trim()
      .email({
        message: "Digite um email válido",
      }),

    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email({
        message: "Digite um email válido",
      }),

    password: z
      .string()
      .min(1, {
        message: "Senha obrigatória",
      }),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});