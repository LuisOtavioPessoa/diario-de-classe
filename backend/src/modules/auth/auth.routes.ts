import { Router } from "express";
import {register,login,} from "./auth.controller";
import { registerSchema, loginSchema } from "../../schemas/auth.schemas";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Cadastrar um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterBody'
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Auth criado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/RegisterResponse'
 *
 *       409:
 *         description: Email já cadastrado
 *         content:
 *           application/json:
 *             example:
 *               message: Email já cadastrado
 *
 *       400:
 *         description: Erro de validação
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
    "/register", 
    validate(registerSchema), 
    register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realizar login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/LoginResponse'
 *
 *       401:
 *         description: Email ou senha inválidos
 *         content:
 *           application/json:
 *             example:
 *               message: Email ou senha inválidos
 *
 *       400:
 *         description: Erro de validação
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
    "/login", 
    validate(loginSchema), 
    login
);

export default router;