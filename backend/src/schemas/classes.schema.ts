import { z } from "zod";

export const createClassSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Nome da turma muito curto")
      .max(20, "Nome da turma muito longo"),

    year: z
      .number()
      .min(2000, "Ano inválido"),
  }),
});

export const listClassesSchema = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(10),

    search: z
      .string()
      .trim()
      .optional(),
  }),
});