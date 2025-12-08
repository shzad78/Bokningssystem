import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renders the logo', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText('Booking System')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
  });

  it('has correct href attributes', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const homeLink = screen.getByText('Home').closest('a');
    const bookLink = screen.getByText('Book').closest('a');
    const bookingsLink = screen.getByText('Bookings').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(bookLink).toHaveAttribute('href', '/book');
    expect(bookingsLink).toHaveAttribute('href', '/bookings');
  });
});
