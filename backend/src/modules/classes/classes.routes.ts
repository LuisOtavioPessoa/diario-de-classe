import { Router } from "express";
import { create , list, deleteClassById} from "./classes.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";
import { classOwnershipMiddleware } from "../../middlewares/ownership.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createClassSchema, listClassesSchema } from "../../schemas/classes.schema";

const router = Router();

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Criar uma nova turma
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClassBody'
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Turma criada com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/ClassResponse'
 *
 *       400:
 *         description: Erro de validação
 *
 *       401:
 *         description: Token não informado ou inválido
 *
 *       409:
 *         description: Já existe uma turma com esse nome nesse ano
 *         content:
 *           application/json:
 *             example:
 *               message: Já existe uma turma com esse nome nesse ano
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
    "/", 
    authMiddleware,
    validate(createClassSchema),
    create
);

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Listar turmas do professor autenticado
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 * 
 *       200:
 *         description: Turmas listadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ClassResponse'
 *
 *       401:
 *         description: Token não informado ou inválido
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
    "/", 
    authMiddleware,
    validate(listClassesSchema),
    list,
);

/**
 * @swagger
 * /api/classes/{id}:
 *   delete:
 *     summary: Excluir uma turma
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da turma
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Turma deletada com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Turma deletada com sucesso
 *
 *       400:
 *         description: ID inválido
 *
 *       401:
 *         description: Token não informado ou inválido
 *
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             example:
 *               message: Acesso negado
 *
 *       404:
 *         description: Turma não encontrada
 *         content:
 *           application/json:
 *             example:
 *               message: Turma não encontrada
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.delete(
    "/:id", 
    authMiddleware,
    validateObjectId(),
    classOwnershipMiddleware,
    deleteClassById
);

export default router;