import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

export const validateObjectId = (
    paramName: string = "id"
) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try{
            const value = req.params[paramName];

            if(
                typeof value !== "string" ||
                !Types.ObjectId.isValid(value)
            ){
                return res.status(400).json({
                    message: "ID inválido",
                });
            }

            next();

        } catch(error){
            return res.status(500).json({
                message: "Erro interno do servidor",
            });
        }
    };
};