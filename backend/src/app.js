import express from "express";
import cors from "cors";
import { router as questionsRouter } from "./routes/questions.route.js";
import { router as answerRouter } from "./routes/answer.route.js";
import { router as votesRouter } from "./routes/votes.routes.js";
import { router as notificationsRouter } from "./routes/notifications.route.js";
import { router as accountRouter } from "./routes/account.route.js";

const app = express();

// configs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  }),
);

// routes
app.use("/api/questions", questionsRouter);
app.use("/api/answers", answerRouter);
app.use("/api/votes", votesRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/account", accountRouter);

// ping
app.get("/ping", (req, res) => {
  res.send("Pong!");
});

export default app;
