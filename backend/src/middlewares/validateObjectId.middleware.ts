import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = req.params.id as string;

        if(!Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "ID Inválido",
            });
        }

        next();
    }catch(error){
        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};