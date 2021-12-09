import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import "express-async-errors";

import "@shared/container";
import createConnection from '@shared/infra/typeorm';
import { router } from "@shared/infra/http/routes";
import { AppError } from "@shared/errors/AppError";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "../../../swagger.json";

createConnection();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  return response.status(500).json({
    status: "error",
    error: `Internal server error - ${err.message}`
  })
});

app.listen(3333, () => {
  console.log(`Server running at http://localhost:3333/`);
});
