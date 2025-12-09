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

  describe('getBooking', () => {
    it('fetches a single booking successfully', async () => {
      const mockBooking = { id: 1, customerName: 'John Doe', service: 'Haircut' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBooking,
      });

      const result = await api.getBooking(1);
      expect(result).toEqual(mockBooking);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/bookings/1');
    });

    it('throws error when booking not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.getBooking(999)).rejects.toThrow('Failed to fetch booking');
    });
  });

  describe('updateBooking', () => {
    it('updates a booking successfully', async () => {
      const updatedBooking = {
        customerName: 'John Updated',
        service: 'Massage',
        date: '2025-12-20'
      };

      const mockResponse = { id: 1, ...updatedBooking };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.updateBooking(1, updatedBooking);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/bookings/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBooking),
      });
    });

    it('throws error when update fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.updateBooking(1, {})).rejects.toThrow('Failed to update booking');
    });
  });

  describe('getTimeSlots', () => {
    it('fetches time slots successfully', async () => {
      const mockTimeSlots = ['09:00', '10:00', '11:00'];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTimeSlots,
      });

      const result = await api.getTimeSlots();
      expect(result).toEqual(mockTimeSlots);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/timeSlots');
    });

    it('throws error when fetch fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.getTimeSlots()).rejects.toThrow('Failed to fetch time slots');
    });
  });

  describe('createBooking error handling', () => {
    it('throws error when create fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.createBooking({})).rejects.toThrow('Failed to create booking');
    });
  });

  describe('deleteBooking error handling', () => {
    it('throws error when delete fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.deleteBooking(1)).rejects.toThrow('Failed to delete booking');
    });
  });
});
