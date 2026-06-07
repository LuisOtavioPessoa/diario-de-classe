import { Request, Response } from "express";
import {
    createPerformanceService,
    listPerformancesByStudentService,
    getPerformanceByMonthService,
    updatePerformanceService,
    deletePerformanceService,
} from "./performances.services";

export const create = async ( req: Request, res: Response) => {
    try {

        const {
            studentId, classId, month, year, description,
        } = req.body;

        const result = await createPerformanceService(
                studentId,
                classId,
                month,
                year,
                description,
            );

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(201).json({
            message: "Desempenho criado com sucesso",
            data: result.data,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const listByStudent = async ( req: Request, res: Response) => {
    try {
        const studentId = req.params.studentId as string;

        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        const result = await listPerformancesByStudentService(
            studentId,
            page,
            limit,
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

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const getPerformanceByMonth = async ( req: Request, res: Response ) => {
    try {

        const studentId = req.params.studentId as string;

        const month = Number(req.query.month);

        const year = Number(req.query.year);

        const result = await getPerformanceByMonthService( studentId, month, year);

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message:
                "Desempenho específico do(a) aluno(a) listado com sucesso",
            data: result.data,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const updatePerformance = async ( req: Request, res: Response ) => {
    try {
        const id = req.params.id as string;

        const { description } = req.body;

        const result = await updatePerformanceService( id, description);

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message:"Desempenho atualizado com sucesso",
            data: result.data,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const deletePerformanceById = async ( req: Request, res: Response ) => {
    try {

        const id = req.params.id as string;

        const result = await deletePerformanceService(id);

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message:
                "Desempenho deletado com sucesso",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};