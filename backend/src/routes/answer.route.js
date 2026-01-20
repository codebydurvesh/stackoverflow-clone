import { Router } from "express";
import { createAnswer } from "../controllers/answers.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", authMiddleware, createAnswer);
export { router };
