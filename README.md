# Booking System

A comprehensive booking system with React frontend and JSON Server backend.

## Features

- Book appointments with various services
- View all bookings
- Manage bookings (create, view, delete)
- Responsive design
- Real-time data persistence

## Tech Stack

### Frontend
- React
- React Router
- Vite
- CSS3

### Testing
- Vitest (Unit tests)
- React Testing Library
- Playwright (E2E tests)

### Backend
- JSON Server (REST API)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Application

Start both frontend and backend together:

```bash
npm start
```

This will start:
- Backend (JSON Server) on `http://localhost:3001`
- Frontend (React) on `http://localhost:5173`

### Individual Commands

Start backend only:
```bash
npm run start:backend
```

Start frontend only:
```bash
npm run start:frontend
```

Build for production:
```bash
npm run build
```

### Testing

Run all tests:
```bash
npm test
```

Run unit tests only:
```bash
npm run test:unit
```

Run unit tests with UI:
```bash
cd frontend && npm run test:unit:ui
```

Run e2e tests:
```bash
npm run test:e2e
```

Note: E2E tests will automatically install Playwright browsers on first run.

### Security Checks

Check for security vulnerabilities:
```bash
npm run security-check
```

This runs `npm audit` on both root and frontend dependencies, checking for moderate, high, and critical vulnerabilities.

Check individual packages:
```bash
npm run audit           # Root dependencies
npm run audit:frontend  # Frontend dependencies
```

**Note:** Security audits are automatically run in CI/CD pipeline on every push and pull request.

## Project Structure

```
Bokningssystem/
├── db.json                           # JSON Server database
├── package.json                      # Root package configuration
├── TESTING.md                        # Comprehensive testing guide
├── SECURITY.md                       # Security policy and guidelines
├── CI_PERFORMANCE.md                 # CI/CD performance documentation
├── Booking_System_API.postman_collection.json  # API test collection
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline with security checks
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API services
│   │   ├── test/                    # Test setup
│   │   ├── **/*.test.{js,jsx}       # Unit tests (Vitest)
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── e2e/                         # End-to-end tests (Playwright)
│   ├── playwright.config.js         # Playwright configuration
│   ├── vite.config.js               # Vite configuration with Vitest
│   └── package.json                 # Frontend dependencies
└── README.md                        # This file
```

## Available Services

- **Haircut** - $50 (30 mins)
- **Massage** - $80 (60 mins)
- **Facial** - $70 (45 mins)
- **Manicure** - $40 (30 mins)

## API Endpoints

The JSON Server provides the following endpoints:

- `GET /bookings` - Get all bookings
- `GET /bookings/:id` - Get a specific booking
- `POST /bookings` - Create a new booking
- `PUT /bookings/:id` - Update a booking
- `DELETE /bookings/:id` - Delete a booking
- `GET /services` - Get all services
- `GET /timeSlots` - Get available time slots

## Documentation

- **[TESTING.md](TESTING.md)** - Complete testing guide (77 tests: Vitest, Playwright, Postman)
- **[SECURITY.md](SECURITY.md)** - Security policy and vulnerability management
- **[CI_PERFORMANCE.md](CI_PERFORMANCE.md)** - CI/CD performance benchmarks and optimization

## CI/CD Pipeline

Automated checks run on every push and pull request:
- ✅ Security audits (npm audit)
- ✅ Code linting (ESLint)
- ✅ Unit tests (45 Vitest tests)
- ✅ E2E tests (21 Playwright tests)
- ✅ Tests on Node.js 18.x and 20.x

Pipeline typically completes in 3-5 minutes.

## License

MIT
