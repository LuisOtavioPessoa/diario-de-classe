import { z } from "zod";

const envSchema = z.object({
  PORT: z.string(),
  MONGO_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);