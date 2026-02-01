import http from "http";
import app, { initializeDatabase } from "./app";
import config from "./config/env";
import logger from "./shared/utils/logger";

const server = http.createServer(app);

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();
    server.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
