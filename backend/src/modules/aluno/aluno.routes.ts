import { Router } from "express";
import { create, listByClass, listById , updateAluno, deleteAlunoById} from "./aluno.controller";

const router = Router();

router.post("/", create);
router.get("/class/:classId", listByClass);
router.get("/:id", listById);
router.put("/:id", updateAluno);
router.delete("/:id", deleteAlunoById);

export default router;