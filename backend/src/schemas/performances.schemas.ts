import { z } from "zod";

export const createPerformanceSchema = z.object({
  body: z.object({
    studentId: z
      .string()
      .min(1, "studentId é obrigatório"),

    classId: z
      .string()
      .min(1, "classId é obrigatório"),

    month: z
      .number()
      .min(1, "Mês inválido")
      .max(12, "Mês inválido"),

    year: z
      .number()
      .min(2000, "Ano inválido"),

    description: z
      .string()
      .trim()
      .min(5, "A descrição deve ter no mínimo 5 caracteres"),
  }),
});

export const updatePerformanceSchema = z.object({
  body: z.object({
    description: z
      .string()
      .trim()
      .min(5, "A descrição deve ter no mínimo 5 caracteres"),
  }),
});

export const getPerformanceByMonthSchema = z.object({
  query: z.object({
    month: z.coerce
      .number()
      .min(1)
      .max(12),

    year: z.coerce
      .number()
      .min(2000),
  }),
});

export const listPerformancesByStudentSchema = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(12),

    year: z.coerce
      .number()
      .min(2000)
      .optional(),

    month: z.coerce
      .number()
      .min(1)
      .max(12)
      .optional(),

    search: z
      .string()
      .trim()
      .optional(),

    sort: z.enum(
      ["year", "month", "createdAt"]
    ).optional(),

    order: z.enum(
      ["asc", "desc"]
    ).optional(),
    
  }),  
})