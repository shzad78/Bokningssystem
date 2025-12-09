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

    // Fill all required fields with valid data
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '555-123-4567' } });
    fireEvent.change(screen.getByLabelText(/Service/i), { target: { value: 'Haircut' } });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: dateString } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '10:00' } });

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

    // Fill all required fields with valid data
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '555-123-4567' } });
    fireEvent.change(screen.getByLabelText(/Service/i), { target: { value: 'Haircut' } });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: dateString } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '10:00' } });

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

    // Fill all required fields with valid data
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '555-123-4567' } });
    fireEvent.change(screen.getByLabelText(/Service/i), { target: { value: 'Haircut' } });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: dateString } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '10:00' } });

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

  // Validation tests
  it('displays validation error for empty name', async () => {
    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText('Name cannot be empty')).toBeInTheDocument();
    });
  });

  it('displays validation error for invalid email', async () => {
    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('displays validation error for short phone number', async () => {
    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    const phoneInput = screen.getByLabelText(/Phone/i);
    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.blur(phoneInput);

    await waitFor(() => {
      expect(screen.getByText(/Phone number must have at least 10 digits/i)).toBeInTheDocument();
    });
  });

  it('prevents submission when validation errors exist', async () => {
    const { container } = render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(api.getServices).toHaveBeenCalled();
    });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Please fix the errors below before submitting')).toBeInTheDocument();
      expect(api.createBooking).not.toHaveBeenCalled();
    });
  });

  it('clears validation error when field is corrected', async () => {
    render(
      <BrowserRouter>
        <BookingForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    
    // Enter invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    // Correct the email
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });

    await waitFor(() => {
      expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument();
    });
  });
});
