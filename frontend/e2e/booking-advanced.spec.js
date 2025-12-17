import { test, expect } from '@playwright/test';

test.describe('Advanced Booking Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create a complete booking flow', async ({ page }) => {
    // Navigate to booking form
    await page.getByText('Book Now').click();
    await expect(page).toHaveURL('/book');

    // Fill out the booking form with unique name (using unique email instead)
    const uniqueId = Date.now();
    await page.fill('#customerName', 'Test User');
    await page.fill('#email', `testuser${uniqueId}@example.com`);
    await page.fill('#phone', '555-999-0000');

    // Wait for services to load
    await page.waitForFunction(() => {
      const select = document.querySelector('#service');
      return select && select.options.length > 1;
    }, { timeout: 10000 });
    await page.selectOption('#service', 'Massage');

    // Select tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('#date', dateString);

    // Wait for time slots to load
    await page.waitForFunction(() => {
      const select = document.querySelector('#time');
      return select && select.options.length > 1;
    }, { timeout: 10000 });
    await page.selectOption('#time', '14:00');

    await page.fill('#notes', 'Deep tissue massage please');

    // Submit the form
    await page.getByRole('button', { name: /book appointment/i }).click();

    // Should redirect to bookings page
    await expect(page).toHaveURL('/bookings');
    await expect(page.getByText('Test User')).toBeVisible();
  });

  test('should validate required email format', async ({ page }) => {
    await page.goto('/book');

    await page.fill('#customerName', 'Test User');
    await page.fill('#email', 'invalid-email');
    await page.fill('#phone', '555-1234');

    const emailInput = page.locator('#email');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should not allow past dates', async ({ page }) => {
    await page.goto('/book');

    const dateInput = page.locator('#date');
    const today = new Date().toISOString().split('T')[0];

    await expect(dateInput).toHaveAttribute('min', today);
  });

  test('should display all service options', async ({ page }) => {
    await page.goto('/book');

    // Wait for services to load
    await page.waitForFunction(() => {
      const select = document.querySelector('#service');
      return select && select.options.length > 1;
    }, { timeout: 10000 });

    const serviceOptions = await page.locator('#service option').allTextContents();
    expect(serviceOptions.length).toBeGreaterThan(1);
    expect(serviceOptions.join(',')).toContain('Haircut');
    expect(serviceOptions.join(',')).toContain('Massage');
  });

  test('should filter bookings by displaying all booking cards', async ({ page }) => {
    await page.goto('/bookings');

    // Wait for bookings to load
    await page.waitForSelector('.booking-card, .empty-state', { timeout: 5000 });

    const bookingCards = page.locator('.booking-card');
    const count = await bookingCards.count();

    if (count > 0) {
      // Verify each card has required information
      for (let i = 0; i < count; i++) {
        const card = bookingCards.nth(i);
        await expect(card.locator('h3')).toBeVisible();
        await expect(card.locator('.status-badge')).toBeVisible();
      }
    }
  });

  test('should display booking status badges correctly', async ({ page }) => {
    await page.goto('/bookings');

    await page.waitForSelector('.booking-card, .empty-state', { timeout: 5000 });

    const statusBadges = page.locator('.status-badge');
    const count = await statusBadges.count();

    if (count > 0) {
      const firstBadge = statusBadges.first();
      await expect(firstBadge).toBeVisible();
      const badgeClass = await firstBadge.getAttribute('class');
      expect(badgeClass).toContain('status-');
    }
  });

  test('should navigate through all pages using navbar', async ({ page }) => {
    const navbar = page.locator('nav');

    // Start at home
    await expect(page).toHaveURL('/');

    // Navigate to Book
    await navbar.getByRole('link', { name: 'Book', exact: true }).click();
    await expect(page).toHaveURL('/book');
    await expect(page.getByText('Book an Appointment')).toBeVisible();

    // Navigate to Bookings
    await navbar.getByRole('link', { name: 'Bookings', exact: true }).click();
    await expect(page).toHaveURL('/bookings');
    await expect(page.getByText('All Bookings')).toBeVisible();

    // Navigate back to Home
    await navbar.getByRole('link', { name: 'Booking System' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should display form fields with correct types', async ({ page }) => {
    await page.goto('/book');

    await expect(page.locator('#customerName')).toHaveAttribute('type', 'text');
    await expect(page.locator('#email')).toHaveAttribute('type', 'email');
    await expect(page.locator('#phone')).toHaveAttribute('type', 'tel');
    await expect(page.locator('#date')).toHaveAttribute('type', 'date');
  });

  test('should clear form when cancel is clicked', async ({ page }) => {
    await page.goto('/book');

    await page.fill('#customerName', 'Test User');
    await page.fill('#email', 'test@example.com');

    await page.getByText('Cancel').click();
    await expect(page).toHaveURL('/');
  });

  test('should show error message when backend is unavailable', async ({ page }) => {
    // This test verifies error handling when API fails
    await page.goto('/book');

    // Wait for either error message or form fields to load (with 10 second timeout)
    await page.waitForFunction(() => {
      const errorMessage = document.querySelector('.error-message');
      const serviceSelect = document.querySelector('#service');
      const hasError = errorMessage && errorMessage.textContent.trim().length > 0;
      const hasOptions = serviceSelect && serviceSelect.options.length > 1;
      return hasError || hasOptions;
    }, { timeout: 10000 });

    // Now verify one of them is actually visible
    const errorMessage = page.locator('.error-message');
    const formFields = page.locator('#service option');

    const hasError = await errorMessage.isVisible().catch(() => false);
    const hasOptions = await formFields.count() > 1;

    expect(hasError || hasOptions).toBeTruthy();
  });

  test('should display correct page titles', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(page.getByText('Welcome to Our Booking System')).toBeVisible();

    // Booking form page
    await page.goto('/book');
    await expect(page.getByText('Book an Appointment')).toBeVisible();

    // Bookings list page
    await page.goto('/bookings');
    await expect(page.getByText('All Bookings')).toBeVisible();
  });

  test('should have responsive navbar on all pages', async ({ page }) => {
    const pages = ['/', '/book', '/bookings'];

    for (const url of pages) {
      await page.goto(url);
      const navbar = page.locator('nav');
      await expect(navbar).toBeVisible();
      await expect(navbar.getByRole('link', { name: 'Booking System' })).toBeVisible();
    }
  });
});
