import http from "http";
import app from "./app";
import config from "./config/env";
import logger from "./shared/utils/logger";

const server = http.createServer(app);

server.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});
