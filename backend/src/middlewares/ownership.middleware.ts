import { Request, Response, NextFunction } from "express";
import {JwtPayload} from "jsonwebtoken";
import { Turma } from "../modules/classes/classes.model";

export const ownershipMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const classId = req.params.id as string;

        const user = req.user as JwtPayload;

        const turma = await Turma.findById(classId);

        if(!turma){
            return res.status(404).json({
                message: "Turma não encontrada",
            })
        }

        if(turma.userId.toString() !== user.id){
            return res.status(403).json({
                message: "Acesso negado",
            });
        }

        next();

    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

