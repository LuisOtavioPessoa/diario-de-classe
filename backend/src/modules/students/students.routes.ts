import { Router } from "express";
import { create, listByClass, listById , updateStudent, deleteStudentById} from "./students.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";
import { createStudentSchema, updateStudentSchema} from "../../schemas/students.schemas";
import { studentOwnershipMiddleware } from "../../middlewares/ownership.middleware";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Cadastrar um novo estudante
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentBody'
 *     responses:
 * 
 *       201:
 *         description: Estudante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aluno criado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/StudentResponse'
 *
 *       400:
 *         description: Erro de validação
 *
 *       401:
 *         description: Token não informado ou inválido
 *
 *       403:
 *         description: Usuário não possui acesso à turma informada
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
router.post(
    "/", 
    validate(createStudentSchema),
    create
);

/**
 * @swagger
 * /api/students/class/{classId}:
 *   get:
 *     summary: Listar estudantes de uma turma
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da turma
 *         example: "6860f2e9d92a4d0f85a6b111"
 *     responses:
 * 
 *       200:
 *         description: Lista de estudantes da turma
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StudentResponse'
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
router.get(
    "/class/:classId", 
    validateObjectId("classId"),
    listByClass
);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Buscar um aluno por ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *         example: "6860f2e9d92a4d0f85a6b111"
 *     responses:
 * 
 *       200:
 *         description: Aluno atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aluno atualizado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/StudentResponse'
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
 *         description: Aluno não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Aluno(a) não encontrado(a)"
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.get(
    "/:id",
    validateObjectId(), 
    studentOwnershipMiddleware(),
    listById
);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Atualizar um aluno
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *         example: "6860f2e9d92a4d0f85a6b111"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdateStudentBody'
 * 
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                      type: string
 *                      example: Aluno atualizado com sucesso
 *                  data:
 *                      $ref: '#/components/schemas/StudentResponse'
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
 *         description: Aluno não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: Aluno(a) não encontrado(a)
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.put(
    "/:id", 
    validateObjectId(),
    studentOwnershipMiddleware(),
    validate(updateStudentSchema),
    updateStudent
);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Excluir um aluno
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *         example: "6860f2e9d92a4d0f85a6b111"
 *     responses:
 *       200:
 *         description: Aluno deletado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Aluno(a) deletado(a) com sucesso
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
 *         description: Aluno não encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: Aluno(a) não encontrado(a)
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.delete(
    "/:id",
    validateObjectId(),
    studentOwnershipMiddleware(),
    deleteStudentById
);

export default router;