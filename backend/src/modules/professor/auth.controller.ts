import { Request, Response } from "express";
import { Professor } from "./professor.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
    try{
        const { name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message: "Dados obrigatórios não enviados",
            });
        }

        const professorExists = await Professor.findOne({
            email,
        });

        if(professorExists){
            return res.status(409).json({
                message: "Email já cadastrado",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const professor = await Professor.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Professor criado com sucesso",
            data: {
                id: professor._id,
                name: professor.name,
                email: professor.email,
            },
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });       
    }
};

export const login = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Dados obrigatórios não enviados",
            });
        }

        const professor = await Professor.findOne({
            email,
        });

        if(!professor){
            return res.status(404).json({
                message: "Email ou senha inválidos",
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            professor.password,
        );

        if(!passwordMatch){
            return res.status(401).json({
                message: "Email ou senha inválidos",
            });
        }

        const token = jwt.sign(
            {
                id: professor._id,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            message: "Login realizado com sucesso",
            token,
            professor: {
                id: professor._id,
                name: professor.name,
                email: professor.email,
            },
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
        message: "Erro interno do servidor",
        });       
    }
};