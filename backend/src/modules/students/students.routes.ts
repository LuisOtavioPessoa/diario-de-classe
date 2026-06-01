import { Router } from "express";
import { create, listByClass, listById , updateStudent, deleteStudentById} from "./students.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";
import { createStudentSchema, updateStudentSchema} from "../../schemas/students.schemas";
import { studentOwnershipMiddleware } from "../../middlewares/ownership.middleware";

const router = Router();

router.use(authMiddleware);

router.post(
    "/", 
    validate(createStudentSchema),
    create
);

router.get(
    "/class/:classId", 
    validateObjectId("classId"),
    listByClass
);

router.get(
    "/:id",
    validateObjectId(), 
    studentOwnershipMiddleware(),
    listById
);

router.put(
    "/:id", 
    validateObjectId(),
    studentOwnershipMiddleware(),
    validate(updateStudentSchema),
    updateStudent
);

router.delete(
    "/:id",
    validateObjectId(),
    studentOwnershipMiddleware(),
    deleteStudentById
);

export default router;