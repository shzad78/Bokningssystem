const API_URL = 'http://localhost:3001';

export const api = {
  // Bookings
  async getBookings() {
    const response = await fetch(`${API_URL}/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },

  async getBooking(id) {
    const response = await fetch(`${API_URL}/bookings/${id}`);
    if (!response.ok) throw new Error('Failed to fetch booking');
    return response.json();
  },

  async createBooking(booking) {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
  },

  async updateBooking(id, booking) {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });
    if (!response.ok) throw new Error('Failed to update booking');
    return response.json();
  },

  async deleteBooking(id) {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete booking');
    return response.json();
  },

  // Services
  async getServices() {
    const response = await fetch(`${API_URL}/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  },

  // Time Slots
  async getTimeSlots() {
    const response = await fetch(`${API_URL}/timeSlots`);
    if (!response.ok) throw new Error('Failed to fetch time slots');
    return response.json();
  },
};
