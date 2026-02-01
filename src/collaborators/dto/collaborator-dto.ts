export interface ImportResponse {
  imported: number;
  ignored: number;
}

export interface CollaboratorResponse {
  id: string;
  name: string;
  email: string;
  city: string;
  company: string;
  createdAt: Date;
}

export interface ListQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
