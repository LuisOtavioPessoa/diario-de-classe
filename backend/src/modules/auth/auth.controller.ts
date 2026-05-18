import { Request, Response } from "express";
import { Auth } from "./auth.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
    try{
        const { name, email, password} = req.body;

        const authExists = await Auth.findOne({
            email,
        });

        if(authExists){
            return res.status(409).json({
                message: "Email já cadastrado",
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const auth = await Auth.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Auth criado com sucesso",
            data: {
                id: auth._id,
                name: auth.name,
                email: auth.email,
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

        const auth = await Auth.findOne({
            email,
        });

        if(!auth){
            return res.status(401).json({
                message: "Email ou senha inválidos",
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            auth.password,
        );

        if(!passwordMatch){
            return res.status(401).json({
                message: "Email ou senha inválidos",
            });
        }

        const token = jwt.sign(
            {
                id: auth._id,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            message: "Login realizado com sucesso",
            token,
            user: {
                id: auth._id,
                name: auth.name,
                email: auth.email,
            },
        });

    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });       
    }
};