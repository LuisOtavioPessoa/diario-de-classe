import { Request, Response } from "express";
import { Class } from "./classes.model";
import { JwtPayload } from "jsonwebtoken";

export const create = async (req: Request, res: Response) => {
    try{
        const { name, year } = req.body;

        const user = req.user as JwtPayload;

        const classExists = await Class.findOne({
            name,
            year,
            userId: user.id,
        })

        if (classExists) {
        return res.status(409).json({
            message: "Já existe uma turma com esse nome nesse ano",
        });
        }

        const classCreated = await Class.create({
            name,
            year,
            userId: user.id,
        });

        return res.status(201).json({
            message: "Turma criada com sucesso",
            data: classCreated ,
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
        const user = req.user as JwtPayload;

        const classes = await Class.find({ userId: user.id, }).sort({year: -1, name: 1,});

        return res.status(200).json({
            data: classes,
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

        const classDeleted = await Class.findByIdAndDelete(id);

        if (!classDeleted) {
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

