import { Router } from "express";
import {register,login,} from "./auth.controller";
import { registerSchema, loginSchema } from "./auth.schemas";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.post(
    "/register", 
    validate(registerSchema), 
    register
);

router.post(
    "/login", 
    validate(loginSchema), 
    login
);

export default router;