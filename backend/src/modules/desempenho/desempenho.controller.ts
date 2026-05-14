import { Request, Response } from "express";
import { Desempenho } from "./desempenho.model";
import { Aluno } from "../aluno/aluno.model";
import { Turma } from "../turma/turma.model";
import { Types } from "mongoose";

export const create = async (req: Request, res: Response) => {
    try{
        const { studentId, classId, month, year, description } = req.body;

        if(!studentId || !classId || !month || !year || !description){
             return res.status(400).json({
                message: "Dados obrigatórios não enviados",
            });
        }

        const turma = await Turma.findById(classId);

        if(!turma){
            return res.status(404).json({
                message: "Turma não encontrada",
            });
        }

        const aluno = await Aluno.findById(studentId);

        if(!aluno){
            return res.status(404).json({
                message: "Aluno(a) não encontrado(a)",
            });
        }

        // valida se o aluno pertence à turma
        if(aluno.classId.toString() !== classId){
            return res.status(400).json({
                message: "O aluno(a) não pertence à turma informada.",
            });
        }

        // valida duplicidade de desempenho
        const desempenhoExists = await Desempenho.findOne({
            studentId,
            month,
            year,
        });

        if(desempenhoExists){
            return res.status(409).json({
                message: "Já existe um desempenho para esse aluno nesse mês e ano",
            });
        }

        const desempenho = await Desempenho.create({
            studentId,
            classId,
            month,
            year,
            description
        });

        return res.status(201).json({
            message: "Desempenho criado com sucesso",
            data: desempenho,
        });

    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const listByStudent = async (req: Request, res: Response) => {
    try{
        const studentId = req.params.studentId as string;

        if(!studentId){
            return res.status(400).json({
                message: "studentId não informado",
            });
        }

        if (!Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                message: "studentId inválido",
            });
        }

        const aluno = await Aluno.findById(studentId);

        if(!aluno){
            return res.status(404).json({
                message: "Aluno(a) não encontrada",
            });
        }

        const desempenhosAluno = await Desempenho.find({studentId}).sort({ year: -1, month: -1, });

        return res.status(200).json({
            message: "Desempenhos do aluno(a) listados com sucesso",
            data: desempenhosAluno,
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};