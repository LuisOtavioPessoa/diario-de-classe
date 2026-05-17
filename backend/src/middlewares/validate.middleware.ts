import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();

    } catch (error) {

      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Erro de validação",
          errors: error.issues,
        });
      }

      return res.status(500).json({
        message: "Erro interno do servidor",
      });
    }
  };
};