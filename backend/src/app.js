import express from "express";
import cors from "cors";
import { router as questionsRouter } from "./routes/questions.route.js";
import { router as answerRouter } from "./routes/answer.route.js";
import { router as votesRouter } from "./routes/votes.routes.js";

const app = express();

// configs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    secure: true,
  }),
);

// routes
app.use("/api/questions", questionsRouter);
app.use("/api/answers", answerRouter);
app.use("/api/votes", votesRouter);

// ping
app.get("/ping", (req, res) => {
  res.send("Pong!");
});

export default app;
