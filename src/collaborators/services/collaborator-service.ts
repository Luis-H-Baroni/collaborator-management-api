import { Op, CreationAttributes } from 'sequelize';
import Collaborator from '../models/collaborator';
import ExternalApiService from './external-api-service';
import { AppError } from '../../shared/middleware/error-handler';
import {
  ImportResponse,
  ListQueryParams,
  CollaboratorResponse,
  PaginatedResponse,
} from '../dto/collaborator-dto';

class CollaboratorService {
  private externalApiService: ExternalApiService;

  constructor(externalApiService?: ExternalApiService) {
    this.externalApiService = externalApiService || new ExternalApiService();
  }

  async importCollaborators(): Promise<ImportResponse> {
    const users = await this.externalApiService.fetchUsers();

    const usersEmailsList = users.map((user) => user.email);
    const existingEmails = await Collaborator.findAll({
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

    await Collaborator.bulkCreate(
      newUsers as CreationAttributes<Collaborator>[],
      {
        ignoreDuplicates: true,
      }
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

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: Record<string, any> = {};

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const { count, rows } = await Collaborator.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [[sort, order.toUpperCase()]],
    });

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
    const collaborator = await Collaborator.findByPk(id);

    if (!collaborator) {
      throw new AppError('Collaborator not found', 404);
    }

    return collaborator as CollaboratorResponse;
  }

  async deleteCollaborator(id: string): Promise<void> {
    const collaborator = await Collaborator.findByPk(id);

    if (!collaborator) {
      throw new AppError('Collaborator not found', 404);
    }

    await collaborator.destroy();
  }
}

export default CollaboratorService;
