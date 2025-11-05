import { useState, useEffect, useCallback } from 'react';
import { experiencesService, Experience, ExperienceDetail, SearchParams } from '../services/experiencesService';

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  const fetchExperiences = useCallback(async (params?: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await experiencesService.getAll(params);
      setExperiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchExperiences = useCallback(async (searchQuery: string) => {
    const params = { ...searchParams, search: searchQuery };
    setSearchParams(params);
    await fetchExperiences(params);
  }, [searchParams, fetchExperiences]);

  const filterByCategory = useCallback(async (category: string) => {
    const params = { ...searchParams, category };
    setSearchParams(params);
    await fetchExperiences(params);
  }, [searchParams, fetchExperiences]);

  const filterByLocation = useCallback(async (location: string) => {
    const params = { ...searchParams, location };
    setSearchParams(params);
    await fetchExperiences(params);
  }, [searchParams, fetchExperiences]);

  const clearFilters = useCallback(async () => {
    setSearchParams({});
    await fetchExperiences();
  }, [fetchExperiences]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return { 
    experiences, 
    loading, 
    error, 
    searchExperiences, 
    filterByCategory, 
    filterByLocation, 
    clearFilters,
    searchParams 
  };
};

export const useExperienceDetail = (id: string | undefined) => {
  const [experience, setExperience] = useState<ExperienceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await experiencesService.getById(id);
        setExperience(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch experience details');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  return { experience, loading, error };
};