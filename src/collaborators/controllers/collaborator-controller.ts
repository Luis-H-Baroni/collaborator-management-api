import { Request, Response, NextFunction } from "express";
import {
  importCollaborators as importCollaboratorsService,
  listCollaborators as listCollaboratorsService,
  getCollaboratorById as getCollaboratorByIdService,
  deleteCollaborator as deleteCollaboratorService,
} from "../services/collaborator-service";

export const importCollaborators = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await importCollaboratorsService();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const listCollaborators = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await listCollaboratorsService(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCollaboratorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await getCollaboratorByIdService(id as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteCollaborator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await deleteCollaboratorService(id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
