import { Router } from "express";
import { create , listByStudent , getPerformanceByMonth, updatePerformance, deletePerformanceById} from "./performances.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";
import { createPerformanceSchema, updatePerformanceSchema,getPerformanceByMonthSchema } from "./performances.schemas";

const router = Router();

router.post(
    "/", 
    authMiddleware,
    validate(createPerformanceSchema),
    create
);

router.get(
    "/student/:studentId", 
    authMiddleware,
    listByStudent,
);

router.get(
    "/student/:studentId/month",
    authMiddleware,
    validate(getPerformanceByMonthSchema), 
    getPerformanceByMonth
);

router.put(
    "/:id", 
    authMiddleware,
    validateObjectId,
    validate(updatePerformanceSchema),
    updatePerformance
);

router.delete(
    "/:id", 
    authMiddleware,
    validateObjectId,
    deletePerformanceById
);

export default router;