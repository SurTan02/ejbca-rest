import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import { router } from "./routes/routes";
import { bearerStrategy } from "./config/auth.config";
import path from "path";


export const createServer = () => {
  const app = express();
  
  app.use(passport.initialize());
  passport.use(bearerStrategy);

  // Enable documentation
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require(path.resolve('dist/swagger.json'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.json())
    .use(cors());
  
  app.use("/api/v1", router);
  return app;
};