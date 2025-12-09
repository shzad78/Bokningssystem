import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app without crashing', () => {
    render(<App />);
    expect(document.querySelector('.app')).toBeInTheDocument();
  });

  it('renders the navigation', () => {
    render(<App />);
    const navLogo = screen.getByRole('link', { name: /Booking System/i });
    expect(navLogo).toBeInTheDocument();
  });
});
