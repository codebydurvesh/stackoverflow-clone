import Router from "express";

const router = Router();

router.post("/", (req, res) => {
  res.send("Vote created");
});

export { router };
