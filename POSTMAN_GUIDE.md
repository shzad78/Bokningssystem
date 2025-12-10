# Postman Collection Guide

## How to Use the Booking System API Postman Collection

This guide will walk you through importing and using the Postman collection to test the Booking System API.

---

## Prerequisites

1. **Install Postman**
   - Download from: https://www.postman.com/downloads/
   - Or use the web version: https://web.postman.com/

2. **Start the API Server**
   ```bash
   npm run start:backend
   ```
   The API should be running on `http://localhost:3001`

---

## Step 1: Import the Collection

### Method 1: Import via File

1. Open Postman
2. Click the **"Import"** button in the top-left corner
3. Click **"Upload Files"** or drag and drop
4. Select `Booking_System_API.postman_collection.json` from your project root
5. Click **"Import"**

### Method 2: Import via Raw Text

1. Open Postman
2. Click **"Import"** → **"Raw text"**
3. Copy and paste the contents of `Booking_System_API.postman_collection.json`
4. Click **"Continue"** → **"Import"**

---

## Step 2: Verify the Collection

After import, you should see:

```
📁 Booking System API Tests
  📁 Bookings (6 requests)
    1. Get All Bookings
    2. Create New Booking
    3. Get Single Booking by ID
    4. Update Booking
    5. Delete Booking
    6. Get Bookings After Delete
  📁 Services (1 request)
    7. Get All Services
  📁 Time Slots (1 request)
    8. Get All Time Slots
  📁 Validation Tests (3 requests)
    9. Create Booking with Missing Fields
    10. Get Non-Existent Booking
    11. Verify API Health
```

---

## Step 3: Check Collection Variables

The collection uses variables for easy configuration:

1. Click on the collection name **"Booking System API Tests"**
2. Go to the **"Variables"** tab
3. Verify these variables:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| baseUrl | `http://localhost:3001` | `http://localhost:3001` |
| bookingId | (empty) | (auto-set during tests) |

**Note:** `bookingId` is automatically set when you create a booking and used in subsequent requests.

---

## Step 4: Run Individual Requests

### Example: Get All Bookings

1. Expand the **"Bookings"** folder
2. Click on **"1. Get All Bookings"**
3. Click the blue **"Send"** button
4. View the response in the bottom panel

**Expected Response:**
```json
[
  {
    "id": 1,
    "customerName": "John Doe",
    "email": "john@example.com",
    ...
  }
]
```

### Example: Create a New Booking

1. Click on **"2. Create New Booking"**
2. Go to the **"Body"** tab to see the request data:
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
3. Modify the data if needed
4. Click **"Send"**
5. The response will include an `id` (automatically saved to `{{bookingId}}`)

**Expected Response:**
```json
{
  "id": 5,
  "customerName": "John Doe",
  ...
}
```

---

## Step 5: Run the Entire Collection

Run all 11 tests sequentially to verify the full API:

### Option 1: Collection Runner (Recommended)

1. Right-click on **"Booking System API Tests"**
2. Select **"Run collection"**
3. Review the test list
4. Click **"Run Booking System API Tests"**
5. Watch the tests execute in sequence

### Option 2: Command Line (Newman)

Install Newman (Postman CLI):
```bash
npm install -g newman
```

Run the collection:
```bash
newman run Booking_System_API.postman_collection.json
```

---

## Step 6: View Test Results

Each request includes automated tests that verify:
- ✅ Status codes (200, 201, 404)
- ✅ Response structure
- ✅ Data validation
- ✅ Response times

### In the Response Panel:

1. After sending a request, go to the **"Test Results"** tab
2. See which tests passed (green ✓) or failed (red ✗)

**Example Test Results:**
```
✓ Status code is 200
✓ Response is an array
✓ Response time is less than 500ms
```

### In Collection Runner:

You'll see a summary like:
```
Run Summary:
Iterations: 1
Requests: 11
Test Scripts: 11
Assertions: 35
Total: 11 / 11 (100%)

Passed: 35
Failed: 0
```

---

## Understanding the Test Flow

The collection is designed to run sequentially:

1. **Get All Bookings** - Verify API is working
2. **Create New Booking** - Creates a test booking, saves `{{bookingId}}`
3. **Get Single Booking** - Uses `{{bookingId}}` to fetch the created booking
4. **Update Booking** - Updates the booking using `{{bookingId}}`
5. **Delete Booking** - Deletes the booking using `{{bookingId}}`
6. **Get Bookings After Delete** - Verifies deletion worked
7. **Get All Services** - Tests services endpoint
8. **Get All Time Slots** - Tests time slots endpoint
9. **Validation Tests** - Tests edge cases and error handling

---

## Customizing Requests

### Change the Base URL

If your API is running on a different port:

1. Click on the collection **"Booking System API Tests"**
2. Go to **"Variables"** tab
3. Change `baseUrl` to your URL (e.g., `http://localhost:8080`)
4. Click **"Save"**

### Edit Request Body

For POST and PUT requests:

1. Select the request
2. Go to the **"Body"** tab
3. Modify the JSON data
4. Click **"Send"**

**Example - Create Booking with Different Data:**
```json
{
  "customerName": "Alice Smith",
  "email": "alice@example.com",
  "phone": "555-987-6543",
  "service": "Massage",
  "date": "2025-12-20",
  "time": "14:00",
  "notes": "Deep tissue massage",
  "status": "confirmed"
}
```

---

## Common Issues & Solutions

### Issue: Connection Refused

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3001`

**Solution:**
```bash
# Make sure the backend is running
npm run start:backend
```

### Issue: 404 Not Found (Get Single Booking)

**Error:** `404 Not Found` when getting booking by ID

**Solution:**
- Run "Create New Booking" first to set `{{bookingId}}`
- Or manually set `bookingId` in collection variables to an existing ID

### Issue: Tests Failing

**Error:** Some tests show red ✗

**Solution:**
1. Check the response in the "Body" tab
2. Verify the API is returning expected data
3. Check collection variables are set correctly
4. Ensure you're running tests in sequence

---

## Advanced Features

### Using Environments

Create different environments (dev, staging, prod):

1. Click the **"Environments"** icon (eye icon) in top-right
2. Click **"+"** to create new environment
3. Add variables:
   - `baseUrl`: `http://localhost:3001` (dev)
   - `baseUrl`: `https://api.example.com` (prod)
4. Select the environment from the dropdown

### Exporting Test Results

After running the collection:

1. Click **"Export Results"** button
2. Save as JSON or HTML
3. Share with your team

### Adding New Tests

Edit existing tests or add new ones:

1. Select a request
2. Go to the **"Tests"** tab
3. Add JavaScript test code:
```javascript
pm.test("Your test name", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('fieldName');
});
```

---

## Quick Reference

### Variables

- `{{baseUrl}}` - API base URL (http://localhost:3001)
- `{{bookingId}}` - Auto-set after creating a booking

### Keyboard Shortcuts

- `Ctrl/Cmd + Enter` - Send request
- `Ctrl/Cmd + S` - Save request
- `Ctrl/Cmd + N` - New request

### Test Snippets (Right sidebar in Tests tab)

- Status code is 200
- Response has JSON property
- Response time is less than 200ms
- Status code is successful (2xx)

---

## Next Steps

After familiarizing yourself with the collection:

1. **Explore the API** - Try different endpoints
2. **Modify test data** - Create your own bookings
3. **Add custom tests** - Write tests for your use cases
4. **Share with team** - Export and share the collection
5. **Integrate with CI/CD** - Use Newman in your pipeline

---

## Resources

- **API Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Postman Learning Center**: https://learning.postman.com/
- **Newman (CLI)**: https://www.npmjs.com/package/newman
- **Postman Community**: https://community.postman.com/

---

## Support

If you encounter issues:

1. Verify the backend is running: `npm run start:backend`
2. Check the API directly: `curl http://localhost:3001/bookings`
3. Review the API Documentation: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. Check Postman Console (View → Show Postman Console) for detailed errors

---

**Happy Testing!** 🚀
