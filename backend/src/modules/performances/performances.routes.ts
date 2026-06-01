import { Router } from "express";
import { create , listByStudent , getPerformanceByMonth, updatePerformance, deletePerformanceById} from "./performances.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";
import { createPerformanceSchema, updatePerformanceSchema,getPerformanceByMonthSchema } from "../../schemas/performances.schemas";
import { studentOwnershipMiddleware, performanceOwnershipMiddleware } from "../../middlewares/ownership.middleware";

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
    validateObjectId("studentId"),
    studentOwnershipMiddleware("studentId"),
    listByStudent
);

router.get(
    "/student/:studentId/month",
    authMiddleware,
    validateObjectId("studentId"),
    studentOwnershipMiddleware("studentId"),
    validate(getPerformanceByMonthSchema),
    getPerformanceByMonth
);

router.put(
    "/:id",
    authMiddleware,
    validateObjectId(),
    performanceOwnershipMiddleware,
    validate(updatePerformanceSchema),
    updatePerformance
);

router.delete(
    "/:id",
    authMiddleware,
    validateObjectId(),
    performanceOwnershipMiddleware,
    deletePerformanceById
);

export default router;