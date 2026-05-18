import { Request, Response } from "express";
import { Student } from "./students.model";
import { Class } from "../classes/classes.model";
import { JwtPayload } from "jsonwebtoken";

export const create = async (req: Request, res: Response) => {
    try{
        const { name, birthDate, gender, disability, classId } = req.body;

        const user = req.user as JwtPayload;

        const classExists = await Class.findById(classId);

        if(!classExists){
            return res.status(404).json({
                message: "Turma não encontrada",
            });
        }

        if (classExists.userId.toString() !== user.id) {
            return res.status(403).json({
                message: "Acesso negado",
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

        const user = req.user as JwtPayload;

        const classExists = await Class.findById(classId);

        if(!classExists){
            return res.status(404).json({
                message: "Turma não encontrada",
            });
        }

        if (classExists.userId.toString() !== user.id) {
            return res.status(403).json({
                message: "Acesso negado",
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

        const deletedStudent = await Student.findByIdAndDelete(id);

        if(!deletedStudent){
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

