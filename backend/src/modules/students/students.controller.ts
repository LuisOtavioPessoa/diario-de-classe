import { Request, Response } from "express";
import { Student } from "./students.model";
import { Class } from "../classes/classes.model";
import { Types } from "mongoose";

export const create = async (req: Request, res: Response) => {
    try{
        const { name, birthDate, gender, disability, classId } = req.body;

        if(!name || !birthDate || !gender || !classId){
            return res.status(400).json({
                message: "Dados obrigatórios não enviados",
            });
        }

        const classExists = await Class.findById(classId);

        if(!classExists){
            return res.status(404).json({
                message: "Turma não encontrada",
            });
        }

        const student = await Student.create({
            name,
            birthDate,
            gender,
            disability,
            classId,
        });

        return res.status(201).json({
            message: "Aluno criado com sucesso",
            data: student,
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

        const classExists = await Class.findById(classId);

        if(!classExists){
            return res.status(404).json({
                message: "Turma não encontrada",
            });
        }

        const students = await Student.find({classId}).sort({ name: 1});

        return res.status(200).json({
            data: students,
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

        const student = await Student.findById(id);

        if(!student){
            return res.status(404).json({
                message: "Aluno(a) não encontrado(a)",
            });
        }

        return res.status(200).json({
            data: student,
        });
    } catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
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

        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if(!updatedStudent){
            return res.status(404).json({
                message: "Aluno(a) não encontrado(a)",
            });
        }

        return res.status(200).json({
            message: "Aluno(a) atualizado(a) com sucesso",
            data: updatedStudent,
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const deleteStudentById = async (req: Request, res: Response) => {
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

        const student = await Student.findByIdAndDelete(id);

        if(!student){
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

