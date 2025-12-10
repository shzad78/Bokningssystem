# Booking System API Documentation

## Overview

The Booking System API is a RESTful API built with JSON Server that provides endpoints for managing bookings, services, and available time slots. The API follows REST principles and returns JSON responses.

## Base URL

```
http://localhost:3001
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Content Type

All requests and responses use `application/json` content type.

```http
Content-Type: application/json
```

---

## API Endpoints

### Bookings

#### 1. Get All Bookings

Retrieve a list of all bookings in the system.

**Endpoint:** `GET /bookings`

**Request:**
```bash
curl http://localhost:3001/bookings
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "customerName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "555-1234",
    "service": "Haircut",
    "date": "2025-12-15",
    "time": "10:00",
    "notes": "Regular haircut",
    "status": "confirmed"
  },
  {
    "id": 2,
    "customerName": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "555-5678",
    "service": "Massage",
    "date": "2025-12-16",
    "time": "14:00",
    "notes": "Deep tissue massage",
    "status": "confirmed"
  }
]
```

---

#### 2. Get Single Booking

Retrieve a specific booking by its ID.

**Endpoint:** `GET /bookings/:id`

**Parameters:**
- `id` (path parameter) - The booking ID

**Request:**
```bash
curl http://localhost:3001/bookings/1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "customerName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "555-1234",
  "service": "Haircut",
  "date": "2025-12-15",
  "time": "10:00",
  "notes": "Regular haircut",
  "status": "confirmed"
}
```

**Error Response:** `404 Not Found`
```json
{}
```

---

#### 3. Create New Booking

Create a new booking in the system.

**Endpoint:** `POST /bookings`

**Request Body:**
```json
{
  "customerName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "555-1234",
  "service": "Haircut",
  "date": "2025-12-15",
  "time": "10:00",
  "notes": "Regular haircut",
  "status": "confirmed"
}
```

**Request:**
```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "555-1234",
    "service": "Haircut",
    "date": "2025-12-15",
    "time": "10:00",
    "notes": "Regular haircut",
    "status": "confirmed"
  }'
```

**Response:** `201 Created`
```json
{
  "id": 3,
  "customerName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "555-1234",
  "service": "Haircut",
  "date": "2025-12-15",
  "time": "10:00",
  "notes": "Regular haircut",
  "status": "confirmed"
}
```

**Field Validation (Frontend):**
- `customerName`: Required, 2-100 characters, letters/spaces/hyphens/apostrophes only
- `email`: Required, valid email format, max 254 characters
- `phone`: Required, 10-15 digits, can include spaces/hyphens/parentheses
- `service`: Required, must be a valid service name
- `date`: Required, cannot be in the past, max 6 months in future
- `time`: Required, must be a valid time slot
- `notes`: Optional, max 500 characters
- `status`: Optional, defaults to "confirmed"

---

#### 4. Update Booking

Update an existing booking completely (replaces all fields).

**Endpoint:** `PUT /bookings/:id`

**Parameters:**
- `id` (path parameter) - The booking ID

**Request Body:**
```json
{
  "customerName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "555-1234",
  "service": "Massage",
  "date": "2025-12-15",
  "time": "14:00",
  "notes": "Changed to massage",
  "status": "confirmed"
}
```

**Request:**
```bash
curl -X PUT http://localhost:3001/bookings/1 \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "555-1234",
    "service": "Massage",
    "date": "2025-12-15",
    "time": "14:00",
    "notes": "Changed to massage",
    "status": "confirmed"
  }'
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "customerName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "555-1234",
  "service": "Massage",
  "date": "2025-12-15",
  "time": "14:00",
  "notes": "Changed to massage",
  "status": "confirmed"
}
```

---

#### 5. Delete Booking

Delete a booking from the system.

**Endpoint:** `DELETE /bookings/:id`

**Parameters:**
- `id` (path parameter) - The booking ID

**Request:**
```bash
curl -X DELETE http://localhost:3001/bookings/1
```

**Response:** `200 OK`
```json
{}
```

---

### Services

#### 6. Get All Services

Retrieve a list of all available services.

**Endpoint:** `GET /services`

**Request:**
```bash
curl http://localhost:3001/services
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Haircut",
    "duration": 30,
    "price": 50,
    "description": "Professional haircut and styling"
  },
  {
    "id": 2,
    "name": "Massage",
    "duration": 60,
    "price": 80,
    "description": "Relaxing full body massage"
  },
  {
    "id": 3,
    "name": "Facial",
    "duration": 45,
    "price": 70,
    "description": "Deep cleansing facial treatment"
  },
  {
    "id": 4,
    "name": "Manicure",
    "duration": 30,
    "price": 40,
    "description": "Hand care and nail polish"
  }
]
```

---

### Time Slots

#### 7. Get All Time Slots

Retrieve a list of all available time slots.

**Endpoint:** `GET /timeSlots`

**Request:**
```bash
curl http://localhost:3001/timeSlots
```

**Response:** `200 OK`
```json
[
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00"
]
```

---

## Data Schemas

### Booking Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | Auto-generated | Unique booking identifier |
| customerName | string | Yes | Customer's full name (2-100 chars) |
| email | string | Yes | Customer's email address |
| phone | string | Yes | Customer's phone number (10-15 digits) |
| service | string | Yes | Name of the service (must match a service) |
| date | string | Yes | Booking date (YYYY-MM-DD format) |
| time | string | Yes | Booking time (HH:MM format) |
| notes | string | No | Additional notes (max 500 chars) |
| status | string | No | Booking status (default: "confirmed") |

### Service Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | Yes | Unique service identifier |
| name | string | Yes | Service name |
| duration | number | Yes | Duration in minutes |
| price | number | Yes | Price in currency units |
| description | string | Yes | Service description |

### Time Slot

Time slots are represented as strings in `HH:MM` format (24-hour time).

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Error Handling

### 404 Not Found

When requesting a resource that doesn't exist:

**Request:**
```bash
curl http://localhost:3001/bookings/999999
```

**Response:** `404 Not Found`
```json
{}
```

### Validation Errors

The JSON Server backend does not perform validation. Validation is handled on the frontend. However, clients should ensure:

- All required fields are present
- Data types match the schema
- Field values meet validation requirements
- Email addresses are in valid format
- Phone numbers contain sufficient digits
- Dates are not in the past
- Time slots are valid

---

## Query Parameters

JSON Server supports advanced filtering and querying:

### Filter by Field

```bash
# Get bookings for a specific customer
curl "http://localhost:3001/bookings?customerName=John%20Doe"

# Get bookings for a specific date
curl "http://localhost:3001/bookings?date=2025-12-15"

# Get bookings with a specific status
curl "http://localhost:3001/bookings?status=confirmed"
```

### Pagination

```bash
# Get 10 bookings per page, page 1
curl "http://localhost:3001/bookings?_page=1&_limit=10"
```

### Sorting

```bash
# Sort bookings by date (ascending)
curl "http://localhost:3001/bookings?_sort=date&_order=asc"

# Sort bookings by date (descending)
curl "http://localhost:3001/bookings?_sort=date&_order=desc"
```

### Search

```bash
# Full-text search across all fields
curl "http://localhost:3001/bookings?q=massage"
```

### Operators

```bash
# Greater than or equal
curl "http://localhost:3001/services?price_gte=50"

# Less than or equal
curl "http://localhost:3001/services?price_lte=100"

# Not equal
curl "http://localhost:3001/bookings?status_ne=cancelled"
```

---

## Rate Limiting

Currently, there are no rate limits on the API.

---

## CORS

The API supports Cross-Origin Resource Sharing (CORS) and can be accessed from any origin.

---

## Testing

### Postman Collection

A comprehensive Postman collection is available at:
```
Booking_System_API.postman_collection.json
```

This collection includes:
- 11 test cases covering all endpoints
- Automated tests for status codes and response validation
- Environment variables for easy configuration
- Complete CRUD operations for bookings
- Sequential test flow with auto-saved variables

### Quick Start:
1. Open Postman
2. Click "Import"
3. Select `Booking_System_API.postman_collection.json`
4. Make sure the backend is running (`npm run start:backend`)
5. Run the collection to test all endpoints

📖 **[Complete Postman Guide](POSTMAN_GUIDE.md)** - Detailed instructions for using the collection, running tests, and troubleshooting

---

## JavaScript Client Example

```javascript
const API_URL = 'http://localhost:3001';

// Get all bookings
async function getBookings() {
  const response = await fetch(`${API_URL}/bookings`);
  return response.json();
}

// Create a booking
async function createBooking(booking) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });
  return response.json();
}

// Update a booking
async function updateBooking(id, booking) {
  const response = await fetch(`${API_URL}/bookings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });
  return response.json();
}

// Delete a booking
async function deleteBooking(id) {
  const response = await fetch(`${API_URL}/bookings/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

// Get all services
async function getServices() {
  const response = await fetch(`${API_URL}/services`);
  return response.json();
}

// Get all time slots
async function getTimeSlots() {
  const response = await fetch(`${API_URL}/timeSlots`);
  return response.json();
}
```

---

## Python Client Example

```python
import requests
import json

API_URL = 'http://localhost:3001'

# Get all bookings
def get_bookings():
    response = requests.get(f'{API_URL}/bookings')
    return response.json()

# Create a booking
def create_booking(booking):
    response = requests.post(
        f'{API_URL}/bookings',
        json=booking,
        headers={'Content-Type': 'application/json'}
    )
    return response.json()

# Update a booking
def update_booking(booking_id, booking):
    response = requests.put(
        f'{API_URL}/bookings/{booking_id}',
        json=booking,
        headers={'Content-Type': 'application/json'}
    )
    return response.json()

# Delete a booking
def delete_booking(booking_id):
    response = requests.delete(f'{API_URL}/bookings/{booking_id}')
    return response.json()

# Example usage
new_booking = {
    'customerName': 'John Doe',
    'email': 'john@example.com',
    'phone': '555-1234',
    'service': 'Haircut',
    'date': '2025-12-15',
    'time': '10:00',
    'notes': 'First visit',
    'status': 'confirmed'
}

booking = create_booking(new_booking)
print(f"Created booking with ID: {booking['id']}")
```

---

## Starting the API Server

### Prerequisites
- Node.js 20.x or higher
- npm

### Installation

```bash
# Install dependencies
npm install

# Start the API server
npm run start:backend
```

The API will be available at `http://localhost:3001`

### Verify API is Running

```bash
curl http://localhost:3001/bookings
```

---

## Additional Resources

- **Postman Collection**: `Booking_System_API.postman_collection.json`
- **Database File**: `db.json`
- **Frontend API Client**: `frontend/src/services/api.js`
- **Security Documentation**: `SECURITY.md`
- **Testing Documentation**: `TESTING.md`

---

## Support

For issues or questions about the API:
1. Check the Postman collection for working examples
2. Review the test files for expected behavior
3. Consult the main README.md for setup instructions

---

## Version

**API Version:** 1.0.0
**Last Updated:** December 2025
**Backend:** JSON Server 0.17.4
