import { Router } from "express";
import { createAnswer } from "../controllers/answers.controller.js";
import { acceptAnswer } from "../controllers/answers.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { deleteAnswer } from "../controllers/answers.controller.js";

const router = Router();

router.post("/create", authMiddleware, createAnswer);
router.patch("/:id/accept", authMiddleware, acceptAnswer);
router.delete("/:id/reject", authMiddleware, deleteAnswer);

export { router };
