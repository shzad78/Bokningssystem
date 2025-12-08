import { test, expect } from '@playwright/test';

test.describe('Booking System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display home page with all elements', async ({ page }) => {
    await expect(page.getByText('Welcome to Our Booking System')).toBeVisible();
    await expect(page.getByText('Book Now')).toBeVisible();
    await expect(page.getByText('View Bookings')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Haircut' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Massage' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Facial' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Manicure' })).toBeVisible();
  });

  test('should navigate to booking form', async ({ page }) => {
    await page.getByText('Book Now').click();
    await expect(page).toHaveURL('/book');
    await expect(page.getByText('Book an Appointment')).toBeVisible();
  });

  test('should navigate to bookings list', async ({ page }) => {
    await page.getByText('View Bookings').click();
    await expect(page).toHaveURL('/bookings');
    await expect(page.getByText('All Bookings')).toBeVisible();
  });

  test('should navigate using navbar links', async ({ page }) => {
    const navbar = page.locator('nav');

    await navbar.getByRole('link', { name: 'Book', exact: true }).click();
    await expect(page).toHaveURL('/book');

    await navbar.getByRole('link', { name: 'Bookings', exact: true }).click();
    await expect(page).toHaveURL('/bookings');

    await navbar.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should fill and validate booking form', async ({ page }) => {
    await page.goto('/book');

    await page.fill('#customerName', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#phone', '555-1234');

    // Wait for service options to load by checking if there are multiple options
    await page.waitForFunction(() => {
      const select = document.querySelector('#service');
      return select && select.options.length > 1;
    }, { timeout: 10000 });
    await page.selectOption('#service', 'Haircut');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('#date', dateString);

    // Wait for time slots to load by checking if there are multiple options
    await page.waitForFunction(() => {
      const select = document.querySelector('#time');
      return select && select.options.length > 1;
    }, { timeout: 10000 });
    await page.selectOption('#time', '10:00');
    await page.fill('#notes', 'Test booking');

    await expect(page.locator('#customerName')).toHaveValue('Test User');
    await expect(page.locator('#email')).toHaveValue('test@example.com');
    await expect(page.locator('#phone')).toHaveValue('555-1234');
  });

  test('should show validation for required fields', async ({ page }) => {
    await page.goto('/book');

    const submitButton = page.getByRole('button', { name: /book appointment/i });
    await submitButton.click();

    const nameInput = page.locator('#customerName');
    await expect(nameInput).toHaveAttribute('required');

    const emailInput = page.locator('#email');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('should cancel and return to home from booking form', async ({ page }) => {
    await page.goto('/book');
    await page.getByText('Cancel').click();
    await expect(page).toHaveURL('/');
  });

  test('should display bookings in the list', async ({ page }) => {
    await page.goto('/bookings');

    // Wait for either bookings to load or empty state
    await page.waitForSelector('.booking-card, .empty-state', { timeout: 5000 });

    const hasBookings = await page.locator('.booking-card').count() > 0;

    if (hasBookings) {
      await expect(page.locator('.booking-card').first()).toBeVisible();
    } else {
      await expect(page.getByText('No bookings found.')).toBeVisible();
    }
  });

  test('should have new booking button on bookings page', async ({ page }) => {
    await page.goto('/bookings');

    const newBookingButton = page.getByText('New Booking');
    await expect(newBookingButton).toBeVisible();

    await newBookingButton.click();
    await expect(page).toHaveURL('/book');
  });
});
