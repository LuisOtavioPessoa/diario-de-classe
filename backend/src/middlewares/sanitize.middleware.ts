import mongoSanitize from "express-mongo-sanitize";
import { RequestHandler } from "express";

export const sanitizeMiddleware: RequestHandler = mongoSanitize({
  replaceWith: "_",
});