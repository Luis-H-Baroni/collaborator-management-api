import { CreationAttributes, FindOptions } from 'sequelize';
import Collaborator from '../models/collaborator';

class CollaboratorRepository {
  async findAll(options: FindOptions): Promise<Collaborator[]> {
    return await Collaborator.findAll(options);
  }

  async bulkCreate(
    records: CreationAttributes<Collaborator>[],
    options?: { ignoreDuplicates: boolean }
  ): Promise<Collaborator[]> {
    return await Collaborator.bulkCreate(records, options);
  }

  async findAndCountAll(options: FindOptions): Promise<{
    count: number;
    rows: Collaborator[];
  }> {
    return await Collaborator.findAndCountAll(options);
  }

  async findByPk(id: string): Promise<Collaborator | null> {
    return await Collaborator.findByPk(id);
  }

  async destroy(collaborator: Collaborator): Promise<void> {
    await collaborator.destroy();
  }
}

export default CollaboratorRepository;
