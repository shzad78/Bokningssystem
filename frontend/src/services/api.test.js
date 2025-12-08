import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api } from './api';

global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getBookings', () => {
    it('fetches bookings successfully', async () => {
      const mockBookings = [
        { id: 1, customerName: 'John Doe', service: 'Haircut' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBookings,
      });

      const result = await api.getBookings();
      expect(result).toEqual(mockBookings);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/bookings');
    });

    it('throws error when fetch fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.getBookings()).rejects.toThrow('Failed to fetch bookings');
    });
  });

  describe('createBooking', () => {
    it('creates a booking successfully', async () => {
      const newBooking = {
        customerName: 'Jane Doe',
        service: 'Massage',
        date: '2025-12-15'
      };

      const mockResponse = { id: 2, ...newBooking };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.createBooking(newBooking);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBooking),
      });
    });
  });

  describe('deleteBooking', () => {
    it('deletes a booking successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await api.deleteBooking(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/bookings/1', {
        method: 'DELETE',
      });
    });
  });

  describe('getServices', () => {
    it('fetches services successfully', async () => {
      const mockServices = [
        { id: 1, name: 'Haircut', price: 50 }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockServices,
      });

      const result = await api.getServices();
      expect(result).toEqual(mockServices);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/services');
    });
  });
});
