import { Request, Response } from "express";
import {
    registerService,
    loginService,
    refreshTokenService, 
    logoutService
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
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
            user: result.data.user,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro interno do servidor",
        });
    }
};

export const refresh = async (
  req: Request,
  res: Response
) => {

  try {

    const { refreshToken } = req.body;

    const result = await refreshTokenService(
      refreshToken
    );

    if (result.error) {
      return res.status(result.status).json({
        message: result.message,
      });
    }

    return res.status(200).json({
      accessToken: result.data.accessToken,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};

export const logout = async (
  req: Request,
  res: Response
) => {

  try {

    const { refreshToken } = req.body;

    await logoutService(refreshToken);

    return res.status(200).json({
      message: "Logout realizado com sucesso",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};