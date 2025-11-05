import { api } from './api';

export interface BookingData {
  experienceId: string;
  scheduleId: string;
  fullName: string;
  email: string;
  quantity: number;
  promoCode?: string;
  totalAmount: number;
}

export interface BookingResponse {
  bookingId: string;
  referenceId: string;
  message: string;
}

export interface PromoCodeData {
  promoCode: string;
  amount: number;
}

export interface PromoCodeResponse {
  promoCode: string;
  discount: number;
  finalAmount: number;
  description: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const bookingsService = {
  // POST /bookings - Create a new booking
  create: async (bookingData: BookingData): Promise<BookingResponse> => {
    try {
      const response = await api.post<APIResponse<BookingResponse>>('/bookings', bookingData);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Failed to create booking');
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
};

export const promoService = {
  // POST /promo/validate - Validate promo code
  validate: async (promoData: PromoCodeData): Promise<PromoCodeResponse> => {
    try {
      const response = await api.post<APIResponse<PromoCodeResponse>>('/promo/validate', promoData);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.error || 'Invalid promo code');
    } catch (error) {
      console.error('Error validating promo code:', error);
      throw error;
    }
  }
};