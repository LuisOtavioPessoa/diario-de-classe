import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    status? : number;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const statusCode = err.status || 500;

    return res.status(statusCode).json({
        error: err.message || "Erro interno do servidor",
    });
};