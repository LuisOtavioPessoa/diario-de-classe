import { Router } from "express";
import { create , list, deleteClassById} from "./classes.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateObjectId } from "../../middlewares/validateObjectId.middleware";
import { classOwnershipMiddleware } from "../../middlewares/ownership.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createClassSchema } from "./classes.schema";

const router = Router();

router.post(
    "/", 
    authMiddleware,
    validate(createClassSchema),
    create
);

router.get(
    "/", 
    authMiddleware,
    list,
);

router.delete(
    "/:id", 
    authMiddleware,
    validateObjectId,
    classOwnershipMiddleware,
    deleteClassById
);

export default router;