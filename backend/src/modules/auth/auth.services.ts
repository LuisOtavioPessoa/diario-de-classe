import { Auth } from "./auth.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ServiceResponse } from "../../types/service.types";
import { LoginResponse, RegisterResponse } from "../../types/auth.types";

export const registerService = async (
    name: string,
    email: string,
    password: string
): Promise<ServiceResponse<RegisterResponse>> => {

    const authExists = await Auth.findOne({
        email,
    });

    if (authExists) {
        return {
            error: true,
            status: 409,
            message: "Email já cadastrado",
        };
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

    return {
        error: false,
        data: {
            id: auth._id.toString(),
            name: auth.name,
            email: auth.email,
        },
    };
};

export const loginService = async (
    email: string,
    password: string
): Promise<ServiceResponse<LoginResponse>> => {

    const auth = await Auth.findOne({
        email,
    });

    if (!auth) {
        return {
            error: true,
            status: 401,
            message: "Email ou senha inválidos",
        };
    }

    const passwordMatch = await bcrypt.compare(
        password,
        auth.password
    );

    if (!passwordMatch) {
        return {
            error: true,
            status: 401,
            message: "Email ou senha inválidos",
        };
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

    return {
        error: false,
        data: {
            token,
            user: {
                id: auth._id.toString(),
                name: auth.name,
                email: auth.email,
            },
        },
    };
};