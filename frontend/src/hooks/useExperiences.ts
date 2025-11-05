import { useState, useEffect } from 'react';
import { experiencesService, Experience, ExperienceDetail } from '../services/experiencesService';

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await experiencesService.getAll();
        setExperiences(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return { experiences, loading, error };
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