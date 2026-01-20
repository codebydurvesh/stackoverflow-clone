import express from "express";
import cors from "cors";
import { router as questionsRouter } from "./routes/questions.route.js";
import { router as answerRouter } from "./routes/answer.route.js";

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

//routes
app.use("/api/questions", questionsRouter);
app.use("/api/answers", answerRouter);

// ping
app.get("/ping", (req, res) => {
  res.send("Pong!");
});

export default app;
