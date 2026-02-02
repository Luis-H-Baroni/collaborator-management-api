import axios from 'axios';
import logger from '../../shared/utils/logger';

interface ExternalUser {
  id: number;
  name: string;
  email: string;
  address: {
    city: string;
  };
  company: {
    name: string;
  };
}

interface MappedUser {
  name: string;
  email: string;
  city: string;
  company: string;
}

class ExternalApiService {
  private apiUrl: string;
  private timeout: number;

  constructor(apiUrl?: string, timeout?: number) {
    this.apiUrl = apiUrl || 'https://jsonplaceholder.typicode.com/users';
    this.timeout = timeout || 10000;
  }

  async fetchUsers(): Promise<MappedUser[]> {
    try {
      logger.info(`Fetching users from external API: ${this.apiUrl}`);
      const response = await axios.get<ExternalUser[]>(this.apiUrl, {
        timeout: this.timeout,
      });

      logger.info(
        `Successfully fetched ${response.data.length} users from external API`
      );
      return response.data.map((user) => ({
        name: user.name,
        email: user.email,
        city: user.address.city,
        company: user.company.name,
      }));
    } catch (error) {
      logger.error('Error fetching users from external API', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch users from external API: ${error.message}`
        );
      }
      throw new Error('Failed to fetch users from external API');
    }
  }
}

export default ExternalApiService;
