import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getMyAccount } from "../controllers/account.controller.js";

const router = Router();

router.get("/me", authMiddleware, getMyAccount);

export { router };
