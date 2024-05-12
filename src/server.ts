import express from "express";
import morgan from "morgan";
import cors from "cors";
import { router } from "./routes/routes";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.json())
    .use(cors())
    .get("/healthz", (req, res) => {
      return res.json({ ok: true });
    });
  
  app.use("/api/v1", router);
  return app;
};