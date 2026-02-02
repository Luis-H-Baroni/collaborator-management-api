import axios from 'axios';

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
      const response = await axios.get<ExternalUser[]>(this.apiUrl, {
        timeout: this.timeout,
      });

      return response.data.map((user) => ({
        name: user.name,
        email: user.email,
        city: user.address.city,
        company: user.company.name,
      }));
    } catch (error) {
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
