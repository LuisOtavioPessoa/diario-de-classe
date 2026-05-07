import { Request, Response } from "express";
import { Turma } from "./turma.model";
import { Professor } from "../professor/professor.model";

export const create = async (req: Request, res: Response) => {
    try{
        const { name, year, userId } = req.body;

        if(!name || !year || !userId){
            return res.status(400).json({
                message: "Dados obrigatórios não enviados",
            });
        }

        const professor = await Professor.findById(userId);

        if(!professor){
            return res.status(404).json({
                message: "Professor não encontrado",
            });
        }

        const turma = await Turma.create({
            name,
            year,
            userId,
        });

        return res.status(201).json({
            message: "Turma criada com sucesso",
            data: turma,
        });

    } catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const list = async (req: Request, res: Response) => {
    try{
        const { userId } = req.body;

        if(!userId){
            return res.status(400).json({
                message: "userId não informado",
            });
        }

        const turmas = await Turma.find({userId});

        return res.status(200).json({
            data: turmas,
        });
    } catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        }); 
    }
};

export const deleteTurmaById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const { userId } = req.body;

        if(!userId){
            return res.status(400).json({
                message: "userId não informado",
            });
        }

        const turma = await Turma.findOneAndDelete({
            _id: id,
            userId,
        });

        if(!turma){
            return res.status(404).json({
                message: "Turma não encontrada",
            });
        }

        return res.status(200).json({
            message: "Turma deletada com sucesso",
        });

    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
}

