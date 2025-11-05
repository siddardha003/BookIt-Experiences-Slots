import { useState } from 'react';
import { bookingsService, promoService, BookingData, PromoCodeData } from '../services/bookingsService';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (bookingData: BookingData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingsService.create(bookingData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
};

export const usePromoCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePromoCode = async (promoData: PromoCodeData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await promoService.validate(promoData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate promo code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { validatePromoCode, loading, error };
};