import { Request, Response } from "express";
import { createClassService, listClassesService, deleteClassService} from "./classes.services";

export const create = async (req: Request, res: Response) => {
    try{
        const { name, year } = req.body;

        const result = await createClassService(
            name,
            year,
            req.user.id
        );

        if(result.error){
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(201).json({
            message: "Turma criada com sucesso",
            data: result.data,
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

        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        const search = req.query.search as string | undefined;
        const year = req.query.year 
            ? Number(req.query.year) 
            : undefined;

        const sort = req.query.sort as | "name" | "year" | "createdAt" | undefined;

        const order = req.query.order as | "asc" | "desc" | undefined;

        const result = await listClassesService(
            req.user.id,
            page,
            limit,
            search,
            year,
            sort,
            order,
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

export const deleteClassById = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;

        const result = await deleteClassService(id);

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
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

