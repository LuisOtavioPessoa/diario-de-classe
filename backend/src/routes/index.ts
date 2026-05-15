import { Router } from "express";

import alunoRoutes from "../modules/aluno/aluno.routes";
import turmaRoutes from "../modules/turma/turma.routes";
import desempenhoRoutes from "../modules/desempenho/desempenho.routes";

const router = Router();

router.use("/students", alunoRoutes);

router.use("/classes", turmaRoutes);

router.use("/performances", desempenhoRoutes);

export default router;