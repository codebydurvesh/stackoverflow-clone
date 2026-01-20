import express from "express";
import cors from "cors";
import { router as questionsRouter } from "./routes/questions.route.js";

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

// ping
app.get("/ping", (req, res) => {
  res.send("Pong!");
});

export default app;
