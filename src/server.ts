import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import { router } from "./routes/routes";
import { bearerStrategy } from "./config/auth.config";


export const createServer = () => {
  const app = express();
  
  app.use(passport.initialize());
  passport.use(bearerStrategy);
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