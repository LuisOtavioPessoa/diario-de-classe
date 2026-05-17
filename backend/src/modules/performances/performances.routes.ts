import { Router } from "express";
import { create , listByStudent , getPerformanceByMonth, updatePerformance, deletePerformanceById} from "./performances.controller";

const router = Router();

router.post("/", create);
router.get("/student/:studentId", listByStudent);
router.get("/student/:studentId/month", getPerformanceByMonth);
router.put("/:id", updatePerformance);
router.delete("/:id", deletePerformanceById);

export default router;