import { Router } from "express";
import { createAnswer } from "../controllers/answers.controller.js";
import { acceptAnswer } from "../controllers/answers.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", authMiddleware, createAnswer);
router.patch("/:id/accept", authMiddleware, acceptAnswer);

export { router };
