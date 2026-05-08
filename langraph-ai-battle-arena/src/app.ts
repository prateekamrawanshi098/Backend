import express from "express";
import runGraph from "./ai/graph.ai.js";

const app = express();
app.use(express.json());
app.get("/battle", async (req, res) => {
  const result = await runGraph("write an code for factorial funtion in java");
  res.json(result);
});

export default app;
