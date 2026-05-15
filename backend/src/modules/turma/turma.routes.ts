import { Router } from "express";
import { create , list, deleteTurmaById} from "./turma.controller";

const router = Router();

router.post("/", create);
router.get("/user/:userId", list);
router.delete("/:id", deleteTurmaById);

export default router;