import { Router } from "express";
import { create , listByStudent , getPerformanceByMonth, updatePerformance, deletePerformanceById} from "./performances.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";
import { createPerformanceSchema, updatePerformanceSchema,getPerformanceByMonthSchema } from "../../schemas/performances.schemas";
import { studentOwnershipMiddleware, performanceOwnershipMiddleware } from "../../middlewares/ownership.middleware";

const router = Router();

/**
 * @swagger
 * /api/performances:
 *   post:
 *     summary: Cadastrar um novo desempenho escolar
 *     tags: [Performances]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePerformanceBody'
 *     responses:
 *       201:
 *         description: Desempenho criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Desempenho criado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/PerformanceResponse'
 *
 *       400:
 *         description: Erro de validação
 *
 *       401:
 *         description: Token não informado ou inválido
 *
 *       404:
 *         description: Aluno ou turma não encontrados
 *         content:
 *           application/json:
 *             example:
 *               message: Aluno ou turma não encontrados
 *
 *       409:
 *         description: Já existe um desempenho para esse aluno no mês e ano informados
 *         content:
 *           application/json:
 *             example:
 *               message: Já existe um desempenho para esse aluno nesse mês e ano
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
    "/", 
    authMiddleware,
    validate(createPerformanceSchema),
    create
);

/**
 * @swagger
 * /api/performances/student/{studentId}:
 *   get:
 *     summary: Listar todos os desempenhos de um aluno
 *     tags: [Performances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *         example: "6860f4f2d92a4d0f85a6b124"
 *     responses:
 *       200:
 *         description: Desempenhos listados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Desempenhos do aluno(a) listados com sucesso
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PerformanceResponse'
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
 *         description: Aluno(a) não encontrado(a)
 *         content:
 *           application/json:
 *             example:
 *               message: Aluno(a) não encontrado(a)
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
    "/student/:studentId",
    authMiddleware,
    validateObjectId("studentId"),
    studentOwnershipMiddleware("studentId"),
    listByStudent
);

/**
 * @swagger
 * /api/performances/student/{studentId}/month:
 *   get:
 *     summary: Buscar desempenho de um aluno em um mês específico
 *     tags: [Performances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         example: "6860f4f2d92a4d0f85a6b124"
 *
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: number
 *         example: 6
 *
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: number
 *         example: 2026
 *
 *     responses:
 *       200:
 *         description: Desempenho encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Desempenho específico do(a) aluno(a)  listado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/PerformanceResponse'
 *
 *       400:
 *         description: Erro de validação
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
 *         description: Aluno ou desempenho não encontrados
 *         content:
 *           application/json:
 *             example:
 *               message: Desempenho não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
    "/student/:studentId/month",
    authMiddleware,
    validateObjectId("studentId"),
    studentOwnershipMiddleware("studentId"),
    validate(getPerformanceByMonthSchema),
    getPerformanceByMonth
);

/**
 * @swagger
 * /api/performances/{id}:
 *   put:
 *     summary: Atualizar descrição de um desempenho
 *     tags: [Performances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do desempenho
 *         example: "6860f9b5d92a4d0f85a6b145"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             description: "Excelente evolução no desenvolvimento cognitivo."
 *
 *     responses:
 *       200:
 *         description: Desempenho atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Desempenho atualizado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/PerformanceResponse'
 *
 *       400:
 *         description: ID inválido ou erro de validação
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
 *         description: Desempenho não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: Desempenho não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.put(
    "/:id",
    authMiddleware,
    validateObjectId(),
    performanceOwnershipMiddleware,
    validate(updatePerformanceSchema),
    updatePerformance
);

/**
 * @swagger
 * /api/performances/{id}:
 *   delete:
 *     summary: Excluir um desempenho
 *     tags: [Performances]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do desempenho
 *         example: "6860f9b5d92a4d0f85a6b145"
 *
 *     responses:
 *       200:
 *         description: Desempenho deletado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Desempenho deletado com sucesso
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
 *         description: Desempenho não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: Desempenho não encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.delete(
    "/:id",
    authMiddleware,
    validateObjectId(),
    performanceOwnershipMiddleware,
    deletePerformanceById
);

export default router;