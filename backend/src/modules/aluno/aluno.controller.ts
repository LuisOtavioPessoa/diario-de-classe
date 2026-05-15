import { Request, Response } from "express";
import { Aluno } from "./aluno.model";
import { Turma } from "../turma/turma.model";
import { Types } from "mongoose";

export const create = async (req: Request, res: Response) => {
    try{
        const { name, birthDate, gender, disability, classId } = req.body;

        if(!name || !birthDate || !gender || !classId){
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

        const aluno = await Aluno.create({
            name,
            birthDate,
            gender,
            disability,
            classId,
        });

        return res.status(201).json({
            message: "Aluno criado com sucesso",
            data: aluno,
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const listByClass = async (req: Request, res: Response) => {
    try{
        const { classId } = req.params;

        if(!classId){
            return res.status(400).json({
                message: "classId não informado",
            });
        }

        const turma = await Turma.findById(classId);

        if(!turma){
            return res.status(404).json({
                message: "Turma não encontrada",
            });
        }

        const alunos = await Aluno.find({classId}).sort({ name: 1});

        return res.status(200).json({
            data: alunos,
        });
    } catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const listById = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;

        if(!id){
            return res.status(400).json({
                message: "Id não informado",
            });
        }

        if(!Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Id inválido",
            });
        }

        const aluno = await Aluno.findById(id);

        if(!aluno){
            return res.status(404).json({
                message: "Aluno(a) não encontrado(a)",
            });
        }

        return res.status(200).json({
            data: aluno,
        });
    } catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const updateAluno = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;

        if(!id){
            return res.status(400).json({
                message: "Id não informado",
            });
        }

        if(!Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Id inválido",
            });
        }

        const alunoUpdate = await Aluno.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if(!alunoUpdate){
            return res.status(404).json({
                message: "Aluno(a) não encontrado(a)",
            });
        }

        return res.status(200).json({
            message: "Aluno(a) atualizado(a) com sucesso",
            data: alunoUpdate,
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const deleteAlunoById = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;

        if (!id) {
            return res.status(400).json({
                message: "Id não informado",
            });
        }

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Id inválido",
            });
        }

        const aluno = await Aluno.findByIdAndDelete(id);

        if(!aluno){
            return res.status(404).json({
                message: "Aluno(a) não encontrado(a)",
            });
        }

        return res.status(200).json({
            message: "Aluno(a) deletado(a) com sucesso",
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
}

