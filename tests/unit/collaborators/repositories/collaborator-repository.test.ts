import CollaboratorRepository from '../../../../src/collaborators/repositories/collaborator-repository';
import Collaborator from '../../../../src/collaborators/models/collaborator';

jest.mock('../../../../src/collaborators/models/collaborator');

describe('collaborator-repository', () => {
  let repository: CollaboratorRepository;

  beforeEach(() => {
    repository = new CollaboratorRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all collaborators with given options', async () => {
      const mockCollaborators = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          city: 'NYC',
          company: 'Acme',
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          city: 'LA',
          company: 'Inc',
        },
      ];

      (Collaborator.findAll as jest.Mock).mockResolvedValue(mockCollaborators);

      const options = {
        where: { city: 'NYC' },
        limit: 10,
      };

      const result = await repository.findAll(options);

      expect(Collaborator.findAll).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockCollaborators);
    });

    it('should return empty array when no collaborators found', async () => {
      (Collaborator.findAll as jest.Mock).mockResolvedValue([]);

      const result = await repository.findAll({});

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      (Collaborator.findAll as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(repository.findAll({})).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should pass attributes option correctly', async () => {
      (Collaborator.findAll as jest.Mock).mockResolvedValue([]);

      await repository.findAll({ attributes: ['email'] });

      expect(Collaborator.findAll).toHaveBeenCalledWith({
        attributes: ['email'],
      });
    });
  });

  describe('bulkCreate', () => {
    it('should create multiple collaborators', async () => {
      const mockRecords = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          city: 'NYC',
          company: 'Acme',
        },
        {
          name: 'Jane Doe',
          email: 'jane@example.com',
          city: 'LA',
          company: 'Inc',
        },
      ] as any;

      const mockCreatedRecords = [
        { id: '1', ...mockRecords[0] },
        { id: '2', ...mockRecords[1] },
      ];

      (Collaborator.bulkCreate as jest.Mock).mockResolvedValue(
        mockCreatedRecords
      );

      const result = await repository.bulkCreate(mockRecords);

      expect(Collaborator.bulkCreate).toHaveBeenCalledWith(
        mockRecords,
        undefined
      );
      expect(result).toEqual(mockCreatedRecords);
    });

    it('should create collaborators with ignoreDuplicates option', async () => {
      const mockRecords = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          city: 'NYC',
          company: 'Acme',
        },
      ] as any;

      (Collaborator.bulkCreate as jest.Mock).mockResolvedValue([]);

      await repository.bulkCreate(mockRecords, { ignoreDuplicates: true });

      expect(Collaborator.bulkCreate).toHaveBeenCalledWith(mockRecords, {
        ignoreDuplicates: true,
      });
    });

    it('should handle empty records array', async () => {
      (Collaborator.bulkCreate as jest.Mock).mockResolvedValue([]);

      const result = await repository.bulkCreate([]);

      expect(Collaborator.bulkCreate).toHaveBeenCalledWith([], undefined);
      expect(result).toEqual([]);
    });

    it('should handle database errors during bulk create', async () => {
      const mockRecords = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          city: 'NYC',
          company: 'Acme',
        },
      ] as any;

      (Collaborator.bulkCreate as jest.Mock).mockRejectedValue(
        new Error('Unique constraint violation')
      );

      await expect(repository.bulkCreate(mockRecords)).rejects.toThrow(
        'Unique constraint violation'
      );
    });
  });

  describe('findAndCountAll', () => {
    it('should return count and rows with given options', async () => {
      const mockRows = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
        },
      ];
      const mockCount = 10;

      (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: mockRows,
        count: mockCount,
      });

      const options = {
        limit: 10,
        offset: 0,
      };

      const result = await repository.findAndCountAll(options);

      expect(Collaborator.findAndCountAll).toHaveBeenCalledWith(options);
      expect(result).toEqual({ rows: mockRows, count: mockCount });
    });

    it('should return zero count and empty rows when no collaborators found', async () => {
      (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await repository.findAndCountAll({});

      expect(result).toEqual({ rows: [], count: 0 });
    });

    it('should handle database errors', async () => {
      (Collaborator.findAndCountAll as jest.Mock).mockRejectedValue(
        new Error('Query timeout')
      );

      await expect(repository.findAndCountAll({})).rejects.toThrow(
        'Query timeout'
      );
    });

    it('should pass where clause correctly', async () => {
      (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [],
        count: 0,
      });

      await repository.findAndCountAll({
        where: { name: 'John' },
      });

      expect(Collaborator.findAndCountAll).toHaveBeenCalledWith({
        where: { name: 'John' },
      });
    });

    it('should pass order clause correctly', async () => {
      (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [],
        count: 0,
      });

      await repository.findAndCountAll({
        order: [['name', 'ASC']],
      });

      expect(Collaborator.findAndCountAll).toHaveBeenCalledWith({
        order: [['name', 'ASC']],
      });
    });
  });

  describe('findByPk', () => {
    it('should return collaborator by primary key', async () => {
      const mockCollaborator = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        city: 'NYC',
        company: 'Acme',
      };

      (Collaborator.findByPk as jest.Mock).mockResolvedValue(mockCollaborator);

      const result = await repository.findByPk('1');

      expect(Collaborator.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCollaborator);
    });

    it('should return null when collaborator not found', async () => {
      (Collaborator.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByPk('nonexistent-id');

      expect(Collaborator.findByPk).toHaveBeenCalledWith('nonexistent-id');
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      (Collaborator.findByPk as jest.Mock).mockRejectedValue(
        new Error('Invalid UUID format')
      );

      await expect(repository.findByPk('invalid-id')).rejects.toThrow(
        'Invalid UUID format'
      );
    });
  });

  describe('destroy', () => {
    it('should destroy a collaborator', async () => {
      const mockCollaborator = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        destroy: jest.fn().mockResolvedValue(undefined),
      };

      await repository.destroy(mockCollaborator as any);

      expect(mockCollaborator.destroy).toHaveBeenCalled();
    });

    it('should handle destroy errors', async () => {
      const mockCollaborator = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        destroy: jest
          .fn()
          .mockRejectedValue(new Error('Foreign key constraint violation')),
      };

      await expect(repository.destroy(mockCollaborator as any)).rejects.toThrow(
        'Foreign key constraint violation'
      );
      expect(mockCollaborator.destroy).toHaveBeenCalled();
    });
  });
});
