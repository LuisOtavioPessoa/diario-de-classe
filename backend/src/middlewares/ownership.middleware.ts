import { Request, Response, NextFunction } from "express";
import {JwtPayload} from "jsonwebtoken";
import { Class} from "../modules/classes/classes.model";
import { Student } from "../modules/students/students.model";
import { Performance } from "../modules/performances/performances.model";

// OWNERSHIP POR TURMA

export const classOwnershipMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const classId = req.params.id as string;

        const user = req.user as JwtPayload;

        const classExists = await Class.findById(classId);

        if(!classExists){
            return res.status(404).json({
                message: "Turma não encontrada",
            })
        }

        if(classExists.userId.toString() !== user.id){
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

// OWNERSHIP POR ALUNO

export const studentOwnershipMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const studentId = req.params.id as string;

        const user = req.user as JwtPayload;

        const student = await Student.findById(studentId);

        if(!student){
            return res.status(404).json({
                message: "Aluno(a) não encontrado(a)",
            })
        }

        const classExists = await Class.findById(student.classId);

        if (!classExists) {
            return res.status(404).json({
                message: "Turma não encontrada",
            });
        }

        if(classExists.userId.toString() !== user.id){
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

// OWNERSHIP POR DESEMPENHO

export const performanceOwnershipMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const performanceId = req.params.id as string;

        const user = req.user as JwtPayload;

        const performance = await Performance.findById(performanceId);

        if (!performance) {
            return res.status(404).json({
                message: "Desempenho não encontrado",
            });
        }

        const classExists = await Class.findById(performance.classId);

        if (!classExists) {
            return res.status(404).json({
                message: "Turma não encontrada",
            });
        }

        if(classExists.userId.toString() !== user.id){
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