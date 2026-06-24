import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/auth.types";
import { authConfig } from "../config/auth";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                message: "Token não informado",
            });
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({
                message: "Token inválido",
            })
        }

        const decoded = jwt.verify(
            token,
            authConfig.accessSecret as string
        ) as AuthPayload;

        req.user = decoded;

        next();
    }catch(error){
        return res.status(401).json({
            message: "Token inválido ou expirado",
        });
    }
};

