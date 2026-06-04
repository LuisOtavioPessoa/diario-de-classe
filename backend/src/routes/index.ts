import { Router } from "express";

import studentsRoutes from "../modules/students/students.routes";
import classesRoutes from "../modules/classes/classes.routes";
import performancesRoutes from "../modules/performances/performances.routes";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.use("/students", studentsRoutes);

router.use("/classes", classesRoutes);

router.use("/performances", performancesRoutes);

router.use("/auth", authRoutes);

export default router;