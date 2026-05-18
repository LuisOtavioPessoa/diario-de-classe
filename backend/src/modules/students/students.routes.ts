import { Router } from "express";
import { create, listByClass, listById , updateStudent, deleteStudentById} from "./students.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";
import { createStudentSchema, updateStudentSchema} from "./students.schemas";

const router = Router();

router.use(authMiddleware);

router.post(
    "/", 
    validate(createStudentSchema),
    create
);

router.get(
    "/class/:classId", 
    listByClass
);

router.get(
    "/:id",
    validateObjectId, 
    listById
);

router.put(
    "/:id", 
    validateObjectId,
    validate(updateStudentSchema),
    updateStudent
);

router.delete(
    "/:id",
    validateObjectId,
    deleteStudentById
);

export default router;