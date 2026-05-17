import { Router } from "express";

import alunoRoutes from "../modules/students/students.routes";
import turmaRoutes from "../modules/classes/classes.routes";
import desempenhoRoutes from "../modules/performances/performances.routes";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.use("/students", alunoRoutes);

router.use("/classes", turmaRoutes);

router.use("/performances", desempenhoRoutes);

router.use("/auth", authRoutes);

export default router;