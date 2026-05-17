import { Router } from "express";
import { create, listByClass, listById , updateStudent, deleteStudentById} from "./students.controller";

const router = Router();

router.post("/", create);
router.get("/class/:classId", listByClass);
router.get("/:id", listById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudentById);

export default router;