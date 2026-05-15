import { Router } from "express";
import { create , listByStudent , getPerformanceByMonth, updateDesempenho, deleteDesempenhoById} from "./desempenho.controller";

const router = Router();

router.post("/", create);
router.get("/student/:studentId", listByStudent);
router.get("/student/:studentId/month", getPerformanceByMonth);
router.put("/:id", updateDesempenho);
router.delete("/:id", deleteDesempenhoById);

export default router;