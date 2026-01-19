import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    secure: true,
  }),
);

app.get("/ping", (req, res) => {
  res.send("Pong!");
});

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

export default app;
