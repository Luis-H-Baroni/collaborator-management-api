import { importCollaborators } from '../collaborators/services/collaborator-service';
import { testConnection, sequelize } from '../config/database';
import logger from '../shared/utils/logger';

const seed = async (): Promise<void> => {
  try {
    logger.info('Starting database seed...');

    await testConnection();

    await sequelize.sync({ force: true });

    logger.info('Importing collaborators from external API...');

    const result = await importCollaborators();

    logger.info(`Seed completed successfully:`);
    logger.info(`  - Imported: ${result.imported}`);
    logger.info(`  - Ignored: ${result.ignored}`);
  } catch (error) {
    logger.error('Error during seed:', error);
    process.exit(1);
  }
};

seed();
