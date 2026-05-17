import rateLimit from "express-rate-limit";

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, 

  max: 100,

  message: {
    message: "Muitas requisições. Tente novamente mais tarde.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});