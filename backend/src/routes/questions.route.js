import { Router } from "express";
import { createQuestion } from "../controllers/questions.controller.js";
import { getAllQuestions } from "../controllers/questions.controller.js";
import { getQuestionById } from "../controllers/questions.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllQuestions);

router.post("/create", authMiddleware, createQuestion);

router.get("/:id", getQuestionById);

export { router };
