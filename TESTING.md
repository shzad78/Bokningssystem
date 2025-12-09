# Testing Documentation

This document describes all testing strategies and how to run tests for the Booking System project.

## Test Overview

The project includes **three comprehensive test suites**:
- **45 Vitest Unit Tests** (Frontend component and API service tests)
- **21 Playwright E2E Tests** (End-to-end browser tests)
- **11 Postman API Tests** (Backend REST API tests)

**Total: 77 Tests**

---

## 1. Vitest Unit Tests (45 tests)

### Description
Unit tests for React components, pages, and API service functions using Vitest and React Testing Library.

### Test Files
- `src/services/api.test.js` (13 tests) - API service functions
- `src/components/Navbar.test.jsx` (3 tests) - Navbar component
- `src/pages/Home.test.jsx` (4 tests) - Home page component
- `src/pages/BookingForm.test.jsx` (10 tests) - Booking form functionality
- `src/pages/BookingList.test.jsx` (13 tests) - Booking list functionality
- `src/App.test.jsx` (2 tests) - Main App component

### Running Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode (for development)
cd frontend && npm run test:unit:ui

# Run tests with coverage
cd frontend && npx vitest run --coverage
```

### What's Tested
- ✅ API service methods (GET, POST, PUT, DELETE)
- ✅ Error handling for failed API calls
- ✅ Component rendering and UI elements
- ✅ Form validation and input handling
- ✅ User interactions (clicks, form submissions)
- ✅ Navigation between pages
- ✅ Loading states and error messages
- ✅ Data formatting and display

---

## 2. Playwright E2E Tests (21 tests)

### Description
End-to-end tests that simulate real user interactions in a browser environment.

### Test Files
- `e2e/booking.spec.js` (9 tests) - Core booking system flows
- `e2e/booking-advanced.spec.js` (12 tests) - Advanced scenarios and edge cases

### Running E2E Tests

```bash
# Install Playwright browsers (first time only)
npm run test:e2e:install

# Run E2E tests (headless)
cd frontend && npm run test:e2e

# Run E2E tests with UI (interactive mode)
cd frontend && npm run test:e2e:ui

# Run specific test file
cd frontend && npx playwright test e2e/booking.spec.js

# Run tests in specific browser
cd frontend && npx playwright test --project=chromium
```

### Prerequisites
1. Start the backend server:
   ```bash
   npm run start:backend
   ```
2. Start the frontend in another terminal:
   ```bash
   npm run dev:frontend
   ```

### What's Tested
- ✅ Home page display and navigation
- ✅ Complete booking creation flow
- ✅ Form validation (required fields, email format, date restrictions)
- ✅ Navigation between all pages
- ✅ Booking list display and filtering
- ✅ Delete booking functionality
- ✅ Service and time slot loading
- ✅ Error handling for backend failures
- ✅ Responsive navbar on all pages
- ✅ Cancel button functionality
- ✅ Status badge display
- ✅ Correct field types and attributes

---

## 3. Postman API Tests (11 tests)

### Description
REST API tests for all backend endpoints using Postman collection.

### Collection File
`Booking_System_API.postman_collection.json`

### Test Categories

#### Bookings Endpoints (6 tests)
1. **Get All Bookings** - Retrieve all bookings
2. **Create New Booking** - Create a new booking with validation
3. **Get Single Booking** - Fetch specific booking by ID
4. **Update Booking** - Modify existing booking
5. **Delete Booking** - Remove booking by ID
6. **Verify Deletion** - Confirm booking was deleted

#### Services Endpoint (1 test)
7. **Get All Services** - Retrieve available services with price validation

#### Time Slots Endpoint (1 test)
8. **Get All Time Slots** - Retrieve available time slots

#### Validation Tests (3 tests)
9. **Create with Missing Fields** - Test partial data handling
10. **Get Non-Existent Booking** - Test 404 error handling
11. **API Health Check** - Verify API responsiveness

### Running Postman Tests

#### Option 1: Using Postman App
1. Open Postman
2. Import the collection: `File > Import > Booking_System_API.postman_collection.json`
3. Ensure backend is running on `http://localhost:3001`
4. Run the entire collection: `Collections > Booking System API Tests > Run`

#### Option 2: Using Newman (CLI)
```bash
# Install Newman globally (first time only)
npm install -g newman

# Run the collection
newman run Booking_System_API.postman_collection.json

# Run with detailed output
newman run Booking_System_API.postman_collection.json --reporters cli,json
```

### Prerequisites
Start the JSON Server backend:
```bash
npm run start:backend
```

### What's Tested
- ✅ All CRUD operations on bookings
- ✅ Response status codes (200, 201, 404)
- ✅ Response data structure and types
- ✅ Required fields validation
- ✅ Email format validation
- ✅ Service price validation
- ✅ Time slot format validation
- ✅ Response time performance
- ✅ Content-Type headers
- ✅ Data persistence after operations
- ✅ Error handling for invalid requests

---

## Running All Tests

### Sequential Execution
```bash
# 1. Run unit tests
npm run test:unit

# 2. Start backend and frontend, then run E2E tests
npm run start:backend  # Terminal 1
npm run dev:frontend   # Terminal 2
cd frontend && npm run test:e2e  # Terminal 3

# 3. Run Postman tests (with backend running)
newman run Booking_System_API.postman_collection.json
```

### CI/CD Pipeline
The GitHub Actions workflow automatically runs:
- ✅ Linting checks
- ✅ Unit tests (Vitest)
- ✅ E2E tests (Playwright)

See `.github/workflows/ci.yml` for configuration.

---

## Test Coverage Summary

| Test Type | Count | Coverage |
|-----------|-------|----------|
| **Unit Tests (Vitest)** | 45 | Components, Services, API calls |
| **E2E Tests (Playwright)** | 21 | User flows, Navigation, Forms |
| **API Tests (Postman)** | 11 | REST endpoints, Validation |
| **Total** | **77** | Full stack coverage |

---

## Writing New Tests

### Adding Vitest Unit Tests
1. Create `*.test.jsx` or `*.test.js` file next to the component
2. Import testing utilities:
   ```javascript
   import { describe, it, expect } from 'vitest';
   import { render, screen } from '@testing-library/react';
   ```
3. Write tests following existing patterns

### Adding Playwright E2E Tests
1. Create `*.spec.js` file in `frontend/e2e/`
2. Import Playwright:
   ```javascript
   import { test, expect } from '@playwright/test';
   ```
3. Use page object model for reusable selectors

### Adding Postman Tests
1. Open the collection in Postman
2. Add new request to appropriate folder
3. Write test scripts in the "Tests" tab using:
   ```javascript
   pm.test("Test name", function () {
       pm.expect(condition).to.be.true;
   });
   ```

---

## Troubleshooting

### Unit Tests Failing
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for missing dependencies
- Verify mocks are properly set up

### E2E Tests Failing
- Ensure backend is running: `npm run start:backend`
- Ensure frontend is running: `npm run dev:frontend`
- Check port conflicts (frontend: 5173, backend: 3001)
- Install browsers: `npm run test:e2e:install`

### Postman Tests Failing
- Verify backend is running on port 3001
- Check `db.json` exists and is readable
- Reset database if needed
- Ensure proper test execution order

---

## Best Practices

1. **Run unit tests frequently** during development
2. **Run E2E tests before committing** major changes
3. **Run API tests** when modifying backend endpoints
4. **Keep tests independent** - each test should clean up after itself
5. **Use descriptive test names** - clearly state what is being tested
6. **Mock external dependencies** in unit tests
7. **Use waitFor** for async operations in tests
8. **Maintain test data** - use fixtures or setup/teardown hooks

---

## Continuous Integration

Tests are automatically run on:
- Every push to `main` or `develop` branches
- Every pull request to `main` or `develop` branches

CI runs on Node.js versions: **18.x** and **20.x**

View test results in GitHub Actions tab of the repository.
