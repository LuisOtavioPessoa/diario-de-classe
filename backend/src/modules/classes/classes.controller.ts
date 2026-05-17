import { Request, Response } from "express";
import { Class } from "./classes.model";
import { Auth } from "../auth/auth.model";

export const create = async (req: Request, res: Response) => {
    try{
        const { name, year, userId } = req.body;

        if(!name || !year || !userId){
            return res.status(400).json({
                message: "Dados obrigatórios não enviados",
            });
        }

        const user = await Auth.findById(userId);

        if(!user){
            return res.status(404).json({
                message: "Professor não encontrado",
            });
        }

        const classCreated = await Class.create({
            name,
            year,
            userId,
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
        const { userId } = req.params;

        if(!userId){
            return res.status(400).json({
                message: "userId não informado",
            });
        }

        const classes = await Class.find({ userId }).sort({year: -1,name: 1,});

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

export const deleteTurmaById = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;
        const { userId } = req.body;

        if(!id){
            return res.status(400).json({
                message: "Id não informado",
            });
        }

        if(!userId){
            return res.status(400).json({
                message: "userId não informado",
            });
        }

        const classDeleted = await Class.findOneAndDelete({
            _id: id,
            userId,
        });

        if(!classDeleted){
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

