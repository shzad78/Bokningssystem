import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookingList from './BookingList';
import { api } from '../services/api';

vi.mock('../services/api');

// Mock window.confirm
global.confirm = vi.fn();

describe('BookingList', () => {
  const mockBookings = [
    {
      id: 1,
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      service: 'Haircut',
      date: '2025-12-15',
      time: '10:00',
      status: 'confirmed',
      notes: 'Regular cut'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-5678',
      service: 'Massage',
      date: '2025-12-16',
      time: '14:00',
      status: 'pending',
      notes: ''
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title', async () => {
    api.getBookings.mockResolvedValue([]);
    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('All Bookings')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    api.getBookings.mockResolvedValue([]);
    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );
    expect(screen.getByText('Loading bookings...')).toBeInTheDocument();
  });

  it('fetches and displays bookings on mount', async () => {
    api.getBookings.mockResolvedValue(mockBookings);

    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.getBookings).toHaveBeenCalled();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('displays empty state when no bookings exist', async () => {
    api.getBookings.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No bookings found.')).toBeInTheDocument();
      expect(screen.getByText('Create your first booking')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    api.getBookings.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load bookings/i)).toBeInTheDocument();
    });
  });

  it('displays all booking details correctly', async () => {
    api.getBookings.mockResolvedValue([mockBookings[0]]);

    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('555-1234')).toBeInTheDocument();
      expect(screen.getByText('Haircut')).toBeInTheDocument();
      expect(screen.getByText('10:00')).toBeInTheDocument();
      expect(screen.getByText('Regular cut')).toBeInTheDocument();
    });
  });

  it('formats date correctly', async () => {
    api.getBookings.mockResolvedValue([mockBookings[0]]);

    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/December 15, 2025/i)).toBeInTheDocument();
    });
  });

  it('displays status badge with correct class', async () => {
    api.getBookings.mockResolvedValue(mockBookings);

    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const confirmedBadge = screen.getByText('confirmed');
      const pendingBadge = screen.getByText('pending');

      expect(confirmedBadge).toHaveClass('status-badge', 'status-confirmed');
      expect(pendingBadge).toHaveClass('status-badge', 'status-pending');
    });
  });

  it('deletes booking when delete button is clicked and confirmed', async () => {
    api.getBookings.mockResolvedValue(mockBookings);
    api.deleteBooking.mockResolvedValue({});
    global.confirm.mockReturnValue(true);

    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this booking?');
      expect(api.deleteBooking).toHaveBeenCalledWith(1);
    });
  });

  it('does not delete booking when delete is cancelled', async () => {
    api.getBookings.mockResolvedValue(mockBookings);
    global.confirm.mockReturnValue(false);

    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(api.deleteBooking).not.toHaveBeenCalled();
  });

  it('displays error when delete fails', async () => {
    api.getBookings.mockResolvedValue(mockBookings);
    api.deleteBooking.mockRejectedValue(new Error('Failed to delete'));
    global.confirm.mockReturnValue(true);

    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Failed to delete booking/i)).toBeInTheDocument();
    });
  });

  it('renders New Booking button', async () => {
    api.getBookings.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const newBookingButtons = screen.getAllByText('New Booking');
      expect(newBookingButtons.length).toBeGreaterThan(0);
    });
  });

  it('does not display notes section when notes are empty', async () => {
    api.getBookings.mockResolvedValue([mockBookings[1]]);

    render(
      <BrowserRouter>
        <BookingList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText(/Notes:/i)).not.toBeInTheDocument();
    });
  });
});
