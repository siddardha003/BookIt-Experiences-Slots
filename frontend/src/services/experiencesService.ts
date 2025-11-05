import { api } from './api';

export interface Experience {
  id: string;
  name: string;
  description?: string;
  short_description: string;
  location: string;
  price: number;
  image_url: string;
  category: string;
  min_age?: number;
}

export interface Schedule {
  id: string;
  date: string;
  time: string;
  slots_available: number;
  total_slots: number;
}

export interface ExperienceDetail extends Experience {
  schedules: Schedule[];
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface SearchParams {
  search?: string;
  category?: string;
  location?: string;
}

export const experiencesService = {
  // GET /experiences - Get all experiences with optional search parameters
  getAll: async (searchParams?: SearchParams): Promise<Experience[]> => {
    try {
      const params = new URLSearchParams();
      if (searchParams?.search) params.append('search', searchParams.search);
      if (searchParams?.category) params.append('category', searchParams.category);
      if (searchParams?.location) params.append('location', searchParams.location);
      
      const queryString = params.toString();
      const url = queryString ? `/experiences?${queryString}` : '/experiences';
      
      const response = await api.get<APIResponse<Experience[]>>(url);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch experiences');
    } catch (error) {
      console.error('Error fetching experiences:', error);
      throw error;
    }
  },

  // GET /experiences/:id - Get experience details with schedules
  getById: async (id: string): Promise<ExperienceDetail> => {
    try {
      const response = await api.get<APIResponse<ExperienceDetail>>(`/experiences/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to fetch experience details');
    } catch (error) {
      console.error('Error fetching experience details:', error);
      throw error;
    }
  }
};