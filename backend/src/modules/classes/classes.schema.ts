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