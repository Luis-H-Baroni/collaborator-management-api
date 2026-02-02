import axios from 'axios';
import { fetchUsers } from '../../../../src/collaborators/services/external-api-service';

jest.mock('axios');

describe('external-api-service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('should fetch and map users from external API', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          address: { city: 'New York' },
          company: { name: 'Acme Inc' },
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          address: { city: 'Los Angeles' },
          company: { name: 'Tech Corp' },
        },
      ];

      (axios.get as jest.Mock).mockResolvedValue({ data: mockUsers });

      const result = await fetchUsers();

      expect(axios.get).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/users',
        { timeout: 10000 }
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        city: 'New York',
        company: 'Acme Inc',
      });
      expect(result[1]).toEqual({
        name: 'Jane Smith',
        email: 'jane@example.com',
        city: 'Los Angeles',
        company: 'Tech Corp',
      });
    });

    it('should map nested address and company fields correctly', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          address: { city: 'San Francisco', street: '123 Main St' },
          company: { name: 'Test Company', catchPhrase: 'Test' },
        },
      ];

      (axios.get as jest.Mock).mockResolvedValue({ data: mockUsers });

      const result = await fetchUsers();

      expect(result[0]).toHaveProperty('city', 'San Francisco');
      expect(result[0]).toHaveProperty('company', 'Test Company');
      expect(result[0]).not.toHaveProperty('address');
      expect(result[0]).not.toHaveProperty('catchPhrase');
    });

    it('should handle empty response', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await fetchUsers();

      expect(result).toEqual([]);
      expect(axios.get).toHaveBeenCalled();
    });

    it('should handle single user response', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'Single User',
          email: 'single@example.com',
          address: { city: 'Single City' },
          company: { name: 'Single Company' },
        },
      ];

      (axios.get as jest.Mock).mockResolvedValue({ data: mockUsers });

      const result = await fetchUsers();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: 'Single User',
        email: 'single@example.com',
        city: 'Single City',
        company: 'Single Company',
      });
    });

    it('should use correct timeout value', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: [] });

      await fetchUsers();

      expect(axios.get).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/users',
        expect.objectContaining({
          timeout: 10000,
        })
      );
    });

    it('should call correct external API URL', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: [] });

      await fetchUsers();

      expect(axios.get).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/users',
        expect.any(Object)
      );
    });

    it('should throw error when axios fails', async () => {
      const mockError = new Error('Network error');
      (axios.get as jest.Mock).mockRejectedValue(mockError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      await expect(fetchUsers()).rejects.toThrow(
        'Failed to fetch users from external API: Network error'
      );
    });

    it('should handle timeout errors', async () => {
      const mockError = new Error('timeout of 10000ms exceeded');
      (axios.get as jest.Mock).mockRejectedValue(mockError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      await expect(fetchUsers()).rejects.toThrow(
        'Failed to fetch users from external API: timeout of 10000ms exceeded'
      );
    });

    it('should handle 5xx server errors', async () => {
      const mockError = {
        response: { status: 500 },
        message: 'Internal Server Error',
      };
      (axios.get as jest.Mock).mockRejectedValue(mockError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      await expect(fetchUsers()).rejects.toThrow(
        'Failed to fetch users from external API: Internal Server Error'
      );
    });

    it('should handle 4xx client errors', async () => {
      const mockError = {
        response: { status: 404 },
        message: 'Not Found',
      };
      (axios.get as jest.Mock).mockRejectedValue(mockError);
      (axios.isAxiosError as unknown as jest.Mock).mockReturnValue(true);

      await expect(fetchUsers()).rejects.toThrow(
        'Failed to fetch users from external API: Not Found'
      );
    });

    it('should handle malformed data from API', async () => {
      const mockMalformedData = [
        {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          address: {},
          company: {},
        },
      ];
      (axios.get as jest.Mock).mockResolvedValue({ data: mockMalformedData });

      const result = await fetchUsers();

      expect(result[0]).toHaveProperty('city');
      expect(result[0]).toHaveProperty('company');
      expect(result[0].city).toBeUndefined();
      expect(result[0].company).toBeUndefined();
    });

    it('should handle missing fields in API response', async () => {
      const mockIncompleteData = [
        {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          address: { city: 'Test City' },
          company: { name: 'Test Co' },
        },
      ];
      (axios.get as jest.Mock).mockResolvedValue({ data: mockIncompleteData });

      const result = await fetchUsers();

      expect(result[0]).toHaveProperty('city', 'Test City');
      expect(result[0]).toHaveProperty('company', 'Test Co');
    });

    it('should handle missing company field', async () => {
      const mockIncompleteData = [
        {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          address: { city: 'Test City' },
          company: {},
        },
      ];
      (axios.get as jest.Mock).mockResolvedValue({ data: mockIncompleteData });

      const result = await fetchUsers();

      expect(result[0]).toHaveProperty('city', 'Test City');
      expect(result[0]).toHaveProperty('company');
      expect(result[0].company).toBeUndefined();
    });
  });
});
