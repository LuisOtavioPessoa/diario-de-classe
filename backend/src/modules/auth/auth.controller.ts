import { Request, Response } from "express";
import {
    registerService,
    loginService,
} from "./auth.services";

export const register = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            name,
            email,
            password,
        } = req.body;

        const result = await registerService(
            name,
            email,
            password
        );

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(201).json({
            message: "Auth criado com sucesso",
            data: result.data,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const login = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            email,
            password,
        } = req.body;

        const result = await loginService(
            email,
            password
        );

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
            });
        }

        return res.status(200).json({
            message: "Login realizado com sucesso",
            token: result.data.token,
            user: result.data.user,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};