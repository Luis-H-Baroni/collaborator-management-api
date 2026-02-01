import { Request, Response, NextFunction } from "express";
import { Op, CreationAttributes } from "sequelize";
import Collaborator from "../models/collaborator";
import { fetchUsers } from "../services/external-api-service";
import { AppError } from "../../shared/middleware/error-handler";
import {
  ImportResponse,
  ListQueryParams,
  CollaboratorResponse,
  PaginatedResponse,
} from "../dto/collaborator-dto";

export const importCollaborators = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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

    const response: ImportResponse = {
      imported: newUsers.length,
      ignored: users.length - newUsers.length,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const listCollaborators = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "10",
      search,
      sort = "createdAt",
      order = "DESC",
    } = req.query as ListQueryParams;

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

    const response: PaginatedResponse<CollaboratorResponse> = {
      data: rows as CollaboratorResponse[],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCollaboratorById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const collaborator = await Collaborator.findByPk(id as string);

    if (!collaborator) {
      throw new AppError("Collaborator not found", 404);
    }

    res.status(200).json(collaborator as CollaboratorResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteCollaborator = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const collaborator = await Collaborator.findByPk(id as string);

    if (!collaborator) {
      throw new AppError("Collaborator not found", 404);
    }

    await collaborator.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
