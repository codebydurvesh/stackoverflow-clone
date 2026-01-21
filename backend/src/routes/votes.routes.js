import Router from "express";
import { castVote } from "../controllers/votes.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/vote", authMiddleware, castVote);

export { router };
