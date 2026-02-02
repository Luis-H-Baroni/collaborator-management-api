import { Sequelize } from 'sequelize';
import config from './env';
import logger from '../shared/utils/logger';

const sequelize = new Sequelize(
  config.postgresDb,
  config.postgresUser,
  config.postgresPassword,
  {
    host: config.postgresHost,
    port: config.postgresPort,
    dialect: 'postgres',
    logging:
      config.nodeEnv === 'development' ? (msg) => logger.debug(msg) : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    return false;
  }
};

export { sequelize, testConnection };
