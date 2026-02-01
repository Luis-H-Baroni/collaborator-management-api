import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  postgresHost: string;
  postgresPort: number;
  postgresUser: string;
  postgresPassword: string;
  postgresDb: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  postgresHost: process.env.POSTGRES_HOST || 'localhost',
  postgresPort: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  postgresUser: process.env.POSTGRES_USER || 'postgres',
  postgresPassword: process.env.POSTGRES_PASSWORD || 'postgres',
  postgresDb: process.env.POSTGRES_DB || 'teste_backend',
};

export default config;
