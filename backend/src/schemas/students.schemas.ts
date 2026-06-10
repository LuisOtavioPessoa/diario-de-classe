import { z } from "zod";

export const createStudentSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "O nome deve ter no mínimo 2 caracteres"),

    birthDate: z.coerce.date({
      message: "Data de nascimento inválida",
    }),

    gender: z.enum(
      ["male", "female"],
      {
        message: "Gênero inválido",
      }
    ),

    disability: z
      .string()
      .trim()
      .optional()
      .nullable(),

    classId: z
      .string()
      .min(1, "classId é obrigatório"),
  }),
});

export const updateStudentSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "O nome deve ter no mínimo 2 caracteres")
      .optional(),

    birthDate: z.coerce
      .date({
        message: "Data de nascimento inválida",
      })
      .optional(),

    gender: z.enum(
      ["male", "female"],
      {
        message: "Gênero inválido",
      }
    ).optional(),

    disability: z
      .string()
      .trim()
      .optional()
      .nullable(),
  }),
});

export const listStudentsByClassSchema = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .min(1)
      .max(60)
      .default(10),

    search: z
      .string()
      .trim()
      .optional(),

    hasDisability: z.coerce
      .boolean()
      .optional(),

    disability: z
      .string()
      .trim()
      .optional(),

    gender: z.enum(
      ["male", "female"],
    )
    .optional()
  }),
});