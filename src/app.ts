import express from "express";
import swaggerUi from "swagger-ui-express";
import collaboratorRoutes from "./collaborators/routes/collaborator-routes";
import {
  errorHandler,
  notFoundHandler,
} from "./shared/middleware/error-handler";
import { sequelize, testConnection } from "./config/database";
import swaggerSpecs from "./config/swagger";

const app = express();

app.use(express.json());

app.use("/collaborators", collaboratorRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(notFoundHandler);

app.use(errorHandler);

export const initializeDatabase = async (): Promise<void> => {
  const isConnected = await testConnection();
  if (!isConnected) {
    throw new Error("Failed to connect to database");
  }

  await sequelize.sync();
};

export default app;
