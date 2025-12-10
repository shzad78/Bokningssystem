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
├── API_DOCUMENTATION.md              # Complete API reference
├── POSTMAN_GUIDE.md                  # Postman collection usage guide
├── TESTING.md                        # Comprehensive testing guide
├── SECURITY.md                       # Security policy and guidelines
├── CI_PERFORMANCE.md                 # CI/CD performance documentation
├── INPUT_VALIDATION.md               # Form validation rules
├── PRODUCTION_TESTING.md             # Production testing guide
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

The JSON Server provides a RESTful API on `http://localhost:3001`:

- `GET /bookings` - Get all bookings
- `GET /bookings/:id` - Get a specific booking
- `POST /bookings` - Create a new booking
- `PUT /bookings/:id` - Update a booking
- `DELETE /bookings/:id` - Delete a booking
- `GET /services` - Get all services
- `GET /timeSlots` - Get available time slots

📖 **[Full API Documentation](API_DOCUMENTATION.md)** - Complete API reference with examples, schemas, and client code

## Documentation

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference with endpoints, examples, and client code
- **[POSTMAN_GUIDE.md](POSTMAN_GUIDE.md)** - Step-by-step guide for using the Postman collection
- **[TESTING.md](TESTING.md)** - Complete testing guide (50+ unit tests, 21 E2E, 11 API tests)
- **[SECURITY.md](SECURITY.md)** - Security policy and vulnerability management
- **[CI_PERFORMANCE.md](CI_PERFORMANCE.md)** - CI/CD performance benchmarks and optimization
- **[PRODUCTION_TESTING.md](PRODUCTION_TESTING.md)** - Production build testing and optimization
- **[INPUT_VALIDATION.md](INPUT_VALIDATION.md)** - Form validation rules and error messages

## CI/CD Pipeline

Automated checks run on every push and pull request:
- ✅ Security audits (npm audit)
- ✅ Code linting (ESLint)
- ✅ Unit tests (45 Vitest tests)
- ✅ Production build (Vite optimization)
- ✅ E2E tests against production build (21 Playwright tests)
- ✅ Tests on Node.js 20.x with browser caching

Pipeline typically completes in 3-5 minutes (with browser cache).

**Note:** E2E tests run against the production build to catch optimization-related bugs.

## License

MIT
