import { Request, Response, NextFunction } from 'express';
import CollaboratorService from '../services/collaborator-service';
import logger from '../../shared/utils/logger';

class CollaboratorController {
  private collaboratorService: CollaboratorService;

  constructor(collaboratorService?: CollaboratorService) {
    this.collaboratorService = collaboratorService || new CollaboratorService();
  }

  async importCollaborators(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('Importing collaborators');
      const result = await this.collaboratorService.importCollaborators();
      res.status(200).json(result);
    } catch (error) {
      logger.error('Error importing collaborators', error);
      next(error);
    }
  }

  async listCollaborators(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('Listing collaborators', req.query);
      const result = await this.collaboratorService.listCollaborators(
        req.query
      );
      res.status(200).json(result);
    } catch (error) {
      logger.error('Error listing collaborators', error);
      next(error);
    }
  }

  async getCollaboratorById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      logger.info(`Getting collaborator by id: ${id}`);
      const result = await this.collaboratorService.getCollaboratorById(
        id as string
      );
      res.status(200).json(result);
    } catch (error) {
      logger.error('Error getting collaborator by id', error);
      next(error);
    }
  }

  async deleteCollaborator(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      logger.info(`Deleting collaborator by id: ${id}`);
      await this.collaboratorService.deleteCollaborator(id as string);
      logger.info(`Collaborator deleted successfully: ${id}`);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting collaborator', error);
      next(error);
    }
  }
}

export default CollaboratorController;
