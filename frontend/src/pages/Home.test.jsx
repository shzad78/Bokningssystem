import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

describe('Home', () => {
  it('renders the hero section', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText('Welcome to Our Booking System')).toBeInTheDocument();
    expect(screen.getByText('Book your appointments easily and manage your reservations')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText('Book Now')).toBeInTheDocument();
    expect(screen.getByText('View Bookings')).toBeInTheDocument();
  });

  it('renders all service cards', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText('Haircut')).toBeInTheDocument();
    expect(screen.getByText('Massage')).toBeInTheDocument();
    expect(screen.getByText('Facial')).toBeInTheDocument();
    expect(screen.getByText('Manicure')).toBeInTheDocument();
  });

  it('displays service prices', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText('$50 - 30 mins')).toBeInTheDocument();
    expect(screen.getByText('$80 - 60 mins')).toBeInTheDocument();
    expect(screen.getByText('$70 - 45 mins')).toBeInTheDocument();
    expect(screen.getByText('$40 - 30 mins')).toBeInTheDocument();
  });
});
