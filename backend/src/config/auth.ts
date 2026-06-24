import { env } from "./env";

export const authConfig = {
  accessSecret: env.JWT_ACCESS_SECRET,
  refreshSecret: env.JWT_REFRESH_SECRET,
  accessExpiresIn: "15m",
  refreshExpiresIn: "7d",
} as const;