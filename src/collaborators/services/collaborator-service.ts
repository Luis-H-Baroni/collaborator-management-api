import { Op, CreationAttributes } from "sequelize";
import Collaborator from "../models/collaborator";
import { fetchUsers } from "./external-api-service";
import { AppError } from "../../shared/middleware/error-handler";
import {
  ImportResponse,
  ListQueryParams,
  CollaboratorResponse,
  PaginatedResponse,
} from "../dto/collaborator-dto";

export const importCollaborators = async (): Promise<ImportResponse> => {
  const users = await fetchUsers();

  const usersEmailsList = users.map((user) => user.email);
  const existingEmails = await Collaborator.findAll({
    attributes: ["email"],
    where: {
      email: {
        [Op.in]: usersEmailsList,
      },
    },
  });

  const existingEmailSet = new Set(
    existingEmails.map((collaborator) => collaborator.email),
  );
  const newUsers = users.filter((u) => !existingEmailSet.has(u.email));

  await Collaborator.bulkCreate(newUsers as CreationAttributes<Collaborator>[], {
    ignoreDuplicates: true,
  });

  return {
    imported: newUsers.length,
    ignored: users.length - newUsers.length,
  };
};

export const listCollaborators = async (
  queryParams: ListQueryParams
): Promise<PaginatedResponse<CollaboratorResponse>> => {
  const {
    page = "1",
    limit = "10",
    search,
    sort = "createdAt",
    order = "DESC",
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
};

export const getCollaboratorById = async (
  id: string
): Promise<CollaboratorResponse> => {
  const collaborator = await Collaborator.findByPk(id);

  if (!collaborator) {
    throw new AppError("Collaborator not found", 404);
  }

  return collaborator as CollaboratorResponse;
};

export const deleteCollaborator = async (id: string): Promise<void> => {
  const collaborator = await Collaborator.findByPk(id);

  if (!collaborator) {
    throw new AppError("Collaborator not found", 404);
  }

  await collaborator.destroy();
};
