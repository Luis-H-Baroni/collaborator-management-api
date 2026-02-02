import { Op } from 'sequelize';
import CollaboratorService from '../../../../src/collaborators/services/collaborator-service';
import ExternalApiService from '../../../../src/collaborators/services/external-api-service';
import Collaborator from '../../../../src/collaborators/models/collaborator';

jest.mock('../../../../src/collaborators/models/collaborator');
jest.mock('../../../../src/collaborators/services/external-api-service');

describe('collaborator-service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CollaboratorService', () => {
    let service: CollaboratorService;
    let mockExternalApiService: jest.Mocked<ExternalApiService>;

    beforeEach(() => {
      mockExternalApiService = {
        fetchUsers: jest.fn(),
      } as unknown as jest.Mocked<ExternalApiService>;
      service = new CollaboratorService(mockExternalApiService);
    });

    describe('importCollaborators', () => {
      it('should import new collaborators and ignore existing ones', async () => {
        const mockUsers = [
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
        ];

        mockExternalApiService.fetchUsers.mockResolvedValue(mockUsers);

        const mockExistingCollaborators = [{ email: 'john@example.com' }];
        (Collaborator.findAll as jest.Mock).mockResolvedValue(
          mockExistingCollaborators
        );
        (Collaborator.bulkCreate as jest.Mock).mockResolvedValue([] as any);

        const result = await service.importCollaborators();

        expect(mockExternalApiService.fetchUsers).toHaveBeenCalled();
        expect(Collaborator.findAll).toHaveBeenCalledWith({
          attributes: ['email'],
          where: {
            email: { [Op.in]: ['john@example.com', 'jane@example.com'] },
          },
        });
        expect(Collaborator.bulkCreate).toHaveBeenCalledWith(
          [
            {
              name: 'Jane Doe',
              email: 'jane@example.com',
              city: 'LA',
              company: 'Inc',
            },
          ],
          { ignoreDuplicates: true }
        );
        expect(result).toEqual({ imported: 1, ignored: 1 });
      });

      it('should handle empty user list', async () => {
        mockExternalApiService.fetchUsers.mockResolvedValue([]);
        (Collaborator.findAll as jest.Mock).mockResolvedValue([]);
        (Collaborator.bulkCreate as jest.Mock).mockResolvedValue([] as any);

        const result = await service.importCollaborators();

        expect(result).toEqual({ imported: 0, ignored: 0 });
      });

      it('should throw error when external API fails', async () => {
        mockExternalApiService.fetchUsers.mockRejectedValue(
          new Error('Failed to fetch users from external API')
        );

        await expect(service.importCollaborators()).rejects.toThrow(
          'Failed to fetch users from external API'
        );
      });

      it('should handle external API timeout error', async () => {
        mockExternalApiService.fetchUsers.mockRejectedValue(
          new Error('timeout of 10000ms exceeded')
        );

        await expect(service.importCollaborators()).rejects.toThrow(
          'timeout of 10000ms exceeded'
        );
      });

      it('should handle database bulkCreate error', async () => {
        const mockUsers = [
          {
            name: 'John Doe',
            email: 'john@example.com',
            city: 'NYC',
            company: 'Acme',
          },
        ];

        mockExternalApiService.fetchUsers.mockResolvedValue(mockUsers);
        (Collaborator.findAll as jest.Mock).mockResolvedValue([]);
        (Collaborator.bulkCreate as jest.Mock).mockRejectedValue(
          new Error('Database connection failed')
        );

        await expect(service.importCollaborators()).rejects.toThrow(
          'Database connection failed'
        );
      });

      it('should handle database findAll error', async () => {
        const mockUsers = [
          {
            name: 'John Doe',
            email: 'john@example.com',
            city: 'NYC',
            company: 'Acme',
          },
        ];

        mockExternalApiService.fetchUsers.mockResolvedValue(mockUsers);
        (Collaborator.findAll as jest.Mock).mockRejectedValue(
          new Error('Database query failed')
        );

        await expect(service.importCollaborators()).rejects.toThrow(
          'Database query failed'
        );
      });
    });

    describe('listCollaborators', () => {
      it('should return paginated collaborators', async () => {
        const mockData = [{ id: '1', name: 'John', email: 'john@example.com' }];
        const mockCount = 10;

        (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
          rows: mockData,
          count: mockCount,
        });

        const result = await service.listCollaborators({
          page: '1',
          limit: '10',
        });

        expect(Collaborator.findAndCountAll).toHaveBeenCalledWith({
          where: {},
          limit: 10,
          offset: 0,
          order: [['createdAt', 'DESC']],
        });
        expect(result).toEqual({
          data: mockData,
          pagination: { page: 1, limit: 10, total: 10, totalPages: 1 },
        });
      });

      it('should filter by search term', async () => {
        (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
          rows: [],
          count: 0,
        });

        await service.listCollaborators({ search: 'John' });

        expect(Collaborator.findAndCountAll).toHaveBeenCalledWith({
          where: { name: { [Op.iLike]: '%John%' } },
          limit: 10,
          offset: 0,
          order: [['createdAt', 'DESC']],
        });
      });

      it('should handle sorting', async () => {
        (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
          rows: [],
          count: 0,
        });

        await service.listCollaborators({ sort: 'name', order: 'asc' });

        expect(Collaborator.findAndCountAll).toHaveBeenCalledWith({
          where: {},
          limit: 10,
          offset: 0,
          order: [['name', 'ASC']],
        });
      });

      it('should handle negative page number', async () => {
        (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
          rows: [],
          count: 0,
        });

        const result = await service.listCollaborators({ page: '-1' });

        expect(Collaborator.findAndCountAll).toHaveBeenCalledWith({
          where: {},
          limit: 10,
          offset: expect.any(Number),
          order: [['createdAt', 'DESC']],
        });
        expect(result.pagination.page).toBe(-1);
      });

      it('should handle zero limit', async () => {
        (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
          rows: [],
          count: 0,
        });

        const result = await service.listCollaborators({ limit: '0' });

        expect(Collaborator.findAndCountAll).toHaveBeenCalledWith({
          where: {},
          limit: 0,
          offset: 0,
          order: [['createdAt', 'DESC']],
        });
        expect(result.pagination.limit).toBe(0);
      });

      it('should handle negative limit', async () => {
        (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
          rows: [],
          count: 0,
        });

        const result = await service.listCollaborators({ limit: '-5' });

        expect(Collaborator.findAndCountAll).toHaveBeenCalledWith({
          where: {},
          limit: -5,
          offset: expect.any(Number),
          order: [['createdAt', 'DESC']],
        });
        expect(result.pagination.limit).toBe(-5);
      });

      it('should handle very large page and limit values', async () => {
        (Collaborator.findAndCountAll as jest.Mock).mockResolvedValue({
          rows: [],
          count: 0,
        });

        await service.listCollaborators({ page: '999999', limit: '1000000' });

        expect(Collaborator.findAndCountAll).toHaveBeenCalledWith({
          where: {},
          limit: 1000000,
          offset: expect.any(Number),
          order: [['createdAt', 'DESC']],
        });
      });

      it('should handle database error in findAndCountAll', async () => {
        (Collaborator.findAndCountAll as jest.Mock).mockRejectedValue(
          new Error('Database query failed')
        );

        await expect(service.listCollaborators({})).rejects.toThrow(
          'Database query failed'
        );
      });
    });

    describe('getCollaboratorById', () => {
      it('should return collaborator by id', async () => {
        const mockCollaborator = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
        };

        (Collaborator.findByPk as jest.Mock).mockResolvedValue(
          mockCollaborator
        );

        const result = await service.getCollaboratorById('1');

        expect(Collaborator.findByPk).toHaveBeenCalledWith('1');
        expect(result).toEqual(mockCollaborator);
      });

      it('should throw error if collaborator not found', async () => {
        (Collaborator.findByPk as jest.Mock).mockResolvedValue(null);

        await expect(service.getCollaboratorById('1')).rejects.toThrow(
          'Collaborator not found'
        );
      });
    });

    describe('deleteCollaborator', () => {
      it('should delete collaborator', async () => {
        const mockCollaborator = {
          id: '1',
          destroy: jest.fn().mockResolvedValue(undefined),
        };

        (Collaborator.findByPk as jest.Mock).mockResolvedValue(
          mockCollaborator
        );

        await service.deleteCollaborator('1');

        expect(Collaborator.findByPk).toHaveBeenCalledWith('1');
        expect(mockCollaborator.destroy).toHaveBeenCalled();
      });

      it('should throw error if collaborator not found', async () => {
        (Collaborator.findByPk as jest.Mock).mockResolvedValue(null);

        await expect(service.deleteCollaborator('1')).rejects.toThrow(
          'Collaborator not found'
        );
      });
    });

    describe('constructor', () => {
      it('should use provided ExternalApiService', () => {
        const customMockService = new ExternalApiService();
        const testService = new CollaboratorService(customMockService);
        expect(testService).toBeDefined();
      });

      it('should create default ExternalApiService when not provided', () => {
        (ExternalApiService as unknown as jest.Mock).mockImplementation(() => ({
          fetchUsers: jest.fn(),
        }));
        const testService = new CollaboratorService();
        expect(testService).toBeDefined();
        expect(ExternalApiService).toHaveBeenCalled();
      });
    });
  });
});
