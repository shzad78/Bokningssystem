import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookingForm from './BookingForm';
import { api } from '../services/api';

vi.mock('../services/api');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('BookingForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getServices.mockResolvedValue([
      { id: 1, name: 'Haircut', price: 50, duration: 30 },
      { id: 2, name: 'Massage', price: 80, duration: 60 },
    ]);
    api.getTimeSlots.mockResolvedValue(['09:00', '10:00', '11:00', '14:00']);
  });

  it('renders the form title', async () => {
    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );
    expect(screen.getByText('Book an Appointment')).toBeInTheDocument();
  });

  it('loads services and time slots on mount', async () => {
    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.getServices).toHaveBeenCalled();
      expect(api.getTimeSlots).toHaveBeenCalled();
    });
  });

  it('displays error when data loading fails', async () => {
    api.getServices.mockRejectedValue(new Error('Failed to load'));

    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load form data/i)).toBeInTheDocument();
    });
  });

  it('renders all form fields', async () => {
    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Service/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Additional Notes/i)).toBeInTheDocument();
    });
  });

  it('updates form data on input change', async () => {
    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    expect(emailInput.value).toBe('john@example.com');
  });

  it('submits form with valid data', async () => {
    api.createBooking.mockResolvedValue({ id: 1 });

    const { container } = render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.getServices).toHaveBeenCalled();
    });

    const form = container.querySelector('form');
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '555-1234' } });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(api.createBooking).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/bookings');
    }, { timeout: 3000 });
  });

  it('displays error when form submission fails', async () => {
    api.createBooking.mockRejectedValue(new Error('Failed to create'));

    const { container } = render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.getServices).toHaveBeenCalled();
    });

    const form = container.querySelector('form');
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Failed to create booking/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('disables submit button while loading', async () => {
    api.createBooking.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 200)));

    const { container } = render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.getServices).toHaveBeenCalled();
    });

    const form = container.querySelector('form');
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });

    fireEvent.submit(form);

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /Booking.../i });
      expect(submitButton).toBeDisabled();
    }, { timeout: 3000 });
  });

  it('navigates to home when cancel button is clicked', async () => {
    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('sets minimum date to today', async () => {
    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    const dateInput = screen.getByLabelText(/Date/i);
    const today = new Date().toISOString().split('T')[0];
    expect(dateInput).toHaveAttribute('min', today);
  });
});
