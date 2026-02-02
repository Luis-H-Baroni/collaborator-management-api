import { Op, CreationAttributes } from 'sequelize';
import Collaborator from '../models/collaborator';
import ExternalApiService from './external-api-service';
import CollaboratorRepository from '../repositories/collaborator-repository';
import { AppError } from '../../shared/middleware/error-handler';
import {
  ImportResponse,
  ListQueryParams,
  CollaboratorResponse,
  PaginatedResponse,
} from '../dto/collaborator-dto';
import logger from '../../shared/utils/logger';

class CollaboratorService {
  private externalApiService: ExternalApiService;
  private collaboratorRepository: CollaboratorRepository;

  constructor(
    externalApiService?: ExternalApiService,
    collaboratorRepository?: CollaboratorRepository
  ) {
    this.externalApiService = externalApiService || new ExternalApiService();
    this.collaboratorRepository =
      collaboratorRepository || new CollaboratorRepository();
  }

  async importCollaborators(): Promise<ImportResponse> {
    const users = await this.externalApiService.fetchUsers();
    logger.info(`Fetched ${users.length} users from external API`);

    const usersEmailsList = users.map((user) => user.email);

    const existingEmails = await this.collaboratorRepository.findAll({
      attributes: ['email'],
      where: {
        email: {
          [Op.in]: usersEmailsList,
        },
      },
    });

    const existingEmailSet = new Set(
      existingEmails.map((collaborator) => collaborator.email)
    );
    const newUsers = users.filter((u) => !existingEmailSet.has(u.email));
    logger.info(`Found ${newUsers.length} new users to import`);

    await this.collaboratorRepository.bulkCreate(
      newUsers as CreationAttributes<Collaborator>[],
      {
        ignoreDuplicates: true,
      }
    );

    logger.info(
      `Import completed: ${newUsers.length} imported, ${users.length - newUsers.length} ignored`
    );
    return {
      imported: newUsers.length,
      ignored: users.length - newUsers.length,
    };
  }

  async listCollaborators(
    queryParams: ListQueryParams
  ): Promise<PaginatedResponse<CollaboratorResponse>> {
    const {
      page = '1',
      limit = '10',
      search,
      sort = 'createdAt',
      order = 'DESC',
    } = queryParams;

    logger.debug('Listing collaborators with params', queryParams);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || pageNum < 1) {
      throw new AppError('Page must be a positive integer', 400);
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new AppError(
        'Limit must be a positive integer between 1 and 100',
        400
      );
    }

    const offset = (pageNum - 1) * limitNum;

    const where: Record<string, any> = {};

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const { count, rows } = await this.collaboratorRepository.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [[sort, order.toUpperCase()]],
    });

    logger.info(`Found ${count} total collaborators, returning ${rows.length}`);
    return {
      data: rows as CollaboratorResponse[],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum),
      },
    };
  }

  async getCollaboratorById(id: string): Promise<CollaboratorResponse> {
    logger.debug(`Fetching collaborator with id: ${id}`);
    const collaborator = await this.collaboratorRepository.findByPk(id);

    if (!collaborator) {
      logger.warn(`Collaborator not found with id: ${id}`);
      throw new AppError('Collaborator not found', 404);
    }

    logger.info(`Collaborator found with id: ${id}`);
    return collaborator as CollaboratorResponse;
  }

  async deleteCollaborator(id: string): Promise<void> {
    logger.debug(`Fetching collaborator for deletion with id: ${id}`);
    const collaborator = await this.collaboratorRepository.findByPk(id);

    if (!collaborator) {
      logger.warn(`Collaborator not found for deletion with id: ${id}`);
      throw new AppError('Collaborator not found', 404);
    }

    logger.debug(`Deleting collaborator with id: ${id}`);
    await this.collaboratorRepository.destroy(collaborator);
    logger.info(`Collaborator deleted successfully with id: ${id}`);
  }
}

export default CollaboratorService;
