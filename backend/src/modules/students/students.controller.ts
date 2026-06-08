import { Request, Response } from "express";
import {
    createStudentService,
    listStudentsByClassService,
    getStudentByIdService,
    updateStudentService,
    deleteStudentService,
} from "./students.services";

export const create = async (req: Request, res: Response) => {
    try{
        const { name, birthDate, gender, disability, classId } = req.body;

        const result = await createStudentService(
            name,
            birthDate,
            gender,
            disability,
            classId,
            req.user.id,
        );

        if(result.error){
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(201).json({
            message: "Aluno criado com sucesso",
            data: result.data,
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
        const classId = req.params.classId as string;

        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        const search = req.query.search as string | undefined;

        const hasDisability = req.query.hasDisability !== undefined
            ? req.query.hasDisability === "true"
            : undefined;

        const disability = req.query.disability as string | undefined;

        const result = await listStudentsByClassService(
            classId,
            req.user.id,
            page,
            limit,
            search,
            hasDisability,
            disability,
        );

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            data: result.data,
            pagination: result.pagination,
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

        const result = await getStudentByIdService(id);

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            data: result.data,
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

        const result = await updateStudentService(
                id,
                req.body
            );

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: "Aluno(a) atualizado(a) com sucesso",
            data: result.data,
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

        const result = await deleteStudentService(id);

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
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

