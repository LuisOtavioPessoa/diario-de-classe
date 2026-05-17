import { Request, Response, NextFunction } from "express";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(404).json({
    message: "Rota não encontrada",
  });
};