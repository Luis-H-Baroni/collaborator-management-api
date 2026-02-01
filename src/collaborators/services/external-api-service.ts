import axios from "axios";

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

const EXTERNAL_API_URL = "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = async (): Promise<MappedUser[]> => {
  try {
    const response = await axios.get<ExternalUser[]>(EXTERNAL_API_URL, {
      timeout: 10000,
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
        `Failed to fetch users from external API: ${error.message}`,
      );
    }
    throw new Error("Failed to fetch users from external API");
  }
};
