# Backend API Documentation

This document describes the API endpoints needed to implement a sync backend for MyExpenses.

## Overview

The sync backend is responsible for storing and synchronizing expense data across multiple devices. The API is RESTful and uses JSON for data exchange.

## Base URL

```
https://your-api-domain.com/api/v1
```

## Authentication

**Note**: The current implementation doesn't include authentication. For production use, add authentication headers:

```
Authorization: Bearer <your-jwt-token>
```

## Data Model

### Expense Object

```json
{
  "id": "exp_1234567890_abc123",
  "amount": 25.50,
  "category": "Food & Dining",
  "description": "Lunch at restaurant",
  "date": "2026-01-28T12:00:00.000Z",
  "currency": "USD",
  "createdAt": "2026-01-28T12:00:00.000Z",
  "updatedAt": "2026-01-28T12:00:00.000Z",
  "syncStatus": "synced"
}
```

## API Endpoints

### 1. Health Check

Check if the API is available.

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-28T12:00:00.000Z"
}
```

### 2. Create or Update Expense

Add a new expense or update an existing one.

```
POST /expenses
```

**Request Body:**
```json
{
  "id": "exp_1234567890_abc123",
  "amount": 25.50,
  "category": "Food & Dining",
  "description": "Lunch at restaurant",
  "date": "2026-01-28T12:00:00.000Z",
  "currency": "USD",
  "createdAt": "2026-01-28T12:00:00.000Z",
  "updatedAt": "2026-01-28T12:00:00.000Z"
}
```

**Response:**
```json
{
  "id": "exp_1234567890_abc123",
  "amount": 25.50,
  "category": "Food & Dining",
  "description": "Lunch at restaurant",
  "date": "2026-01-28T12:00:00.000Z",
  "currency": "USD",
  "createdAt": "2026-01-28T12:00:00.000Z",
  "updatedAt": "2026-01-28T12:00:00.000Z",
  "syncStatus": "synced"
}
```

### 3. Get All Expenses

Retrieve all expenses for the authenticated user.

```
GET /expenses
```

**Query Parameters:**
- `category` (optional): Filter by category
- `startDate` (optional): Filter expenses after this date (ISO 8601)
- `endDate` (optional): Filter expenses before this date (ISO 8601)

**Response:**
```json
[
  {
    "id": "exp_1234567890_abc123",
    "amount": 25.50,
    "category": "Food & Dining",
    "description": "Lunch at restaurant",
    "date": "2026-01-28T12:00:00.000Z",
    "currency": "USD",
    "createdAt": "2026-01-28T12:00:00.000Z",
    "updatedAt": "2026-01-28T12:00:00.000Z"
  }
]
```

### 4. Delete Expense

Delete a specific expense.

```
DELETE /expenses/:id
```

**Response:**
```json
{
  "success": true,
  "id": "exp_1234567890_abc123"
}
```

### 5. Bulk Sync

Synchronize multiple expenses at once.

```
POST /expenses/sync
```

**Request Body:**
```json
[
  {
    "id": "exp_1234567890_abc123",
    "amount": 25.50,
    "category": "Food & Dining",
    "description": "Lunch at restaurant",
    "date": "2026-01-28T12:00:00.000Z",
    "currency": "USD",
    "createdAt": "2026-01-28T12:00:00.000Z",
    "updatedAt": "2026-01-28T12:00:00.000Z"
  }
]
```

**Response:**
Returns all expenses after synchronization (merged with server data):
```json
[
  {
    "id": "exp_1234567890_abc123",
    "amount": 25.50,
    "category": "Food & Dining",
    "description": "Lunch at restaurant",
    "date": "2026-01-28T12:00:00.000Z",
    "currency": "USD",
    "createdAt": "2026-01-28T12:00:00.000Z",
    "updatedAt": "2026-01-28T12:00:00.000Z",
    "syncStatus": "synced"
  }
]
```

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

### Common Error Codes

- `400` - Bad Request (invalid data)
- `401` - Unauthorized (missing or invalid auth token)
- `404` - Not Found (expense doesn't exist)
- `500` - Internal Server Error

## Implementation Examples

### Node.js/Express Example

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// In-memory storage (use database in production)
const expenses = new Map();

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create/Update expense
app.post('/api/v1/expenses', (req, res) => {
  const expense = req.body;
  expense.syncStatus = 'synced';
  expenses.set(expense.id, expense);
  res.json(expense);
});

// Get all expenses
app.get('/api/v1/expenses', (req, res) => {
  res.json(Array.from(expenses.values()));
});

// Delete expense
app.delete('/api/v1/expenses/:id', (req, res) => {
  expenses.delete(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Bulk sync
app.post('/api/v1/expenses/sync', (req, res) => {
  const clientExpenses = req.body;
  
  // Merge with server data (simple last-write-wins)
  clientExpenses.forEach(expense => {
    const existing = expenses.get(expense.id);
    if (!existing || new Date(expense.updatedAt) > new Date(existing.updatedAt)) {
      expense.syncStatus = 'synced';
      expenses.set(expense.id, expense);
    }
  });
  
  res.json(Array.from(expenses.values()));
});

app.listen(3000, () => {
  console.log('API server running on port 3000');
});
```

### Python/Flask Example

```python
from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)
expenses = {}

@app.route('/api/v1/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})

@app.route('/api/v1/expenses', methods=['POST'])
def create_expense():
    expense = request.json
    expense['syncStatus'] = 'synced'
    expenses[expense['id']] = expense
    return jsonify(expense)

@app.route('/api/v1/expenses', methods=['GET'])
def get_expenses():
    return jsonify(list(expenses.values()))

@app.route('/api/v1/expenses/<expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    if expense_id in expenses:
        del expenses[expense_id]
    return jsonify({'success': True, 'id': expense_id})

@app.route('/api/v1/expenses/sync', methods=['POST'])
def sync_expenses():
    client_expenses = request.json
    
    for expense in client_expenses:
        expense_id = expense['id']
        existing = expenses.get(expense_id)
        
        if not existing or expense['updatedAt'] > existing['updatedAt']:
            expense['syncStatus'] = 'synced'
            expenses[expense_id] = expense
    
    return jsonify(list(expenses.values()))

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

## Database Schema

Recommended database schema (SQL):

```sql
CREATE TABLE expenses (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    currency VARCHAR(3) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    INDEX idx_user_date (user_id, date),
    INDEX idx_user_category (user_id, category)
);
```

## Deployment Options

### Quick Deployment Options

1. **Heroku**: Deploy Node.js/Python app directly
2. **Vercel**: Serverless functions with Next.js API routes
3. **AWS Lambda**: Serverless with API Gateway
4. **Firebase**: Cloud Functions + Firestore
5. **Railway**: Simple container deployment

### Configuration in App

Update the sync adapter initialization:

```javascript
// Mobile: mobile/app/index.js
// Desktop: desktop/src/app.js

const syncAdapter = new RestApiSyncAdapter('https://your-api-domain.com/api/v1');
```

## Security Considerations

1. **Authentication**: Add JWT or OAuth2 authentication
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Input Validation**: Validate all input data
5. **CORS**: Configure CORS properly for web clients
6. **Data Encryption**: Encrypt sensitive data at rest

## Testing the API

Use curl to test your endpoints:

```bash
# Health check
curl https://your-api-domain.com/api/v1/health

# Create expense
curl -X POST https://your-api-domain.com/api/v1/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "id": "exp_test_123",
    "amount": 25.50,
    "category": "Food & Dining",
    "description": "Test expense",
    "date": "2026-01-28T12:00:00.000Z",
    "currency": "USD",
    "createdAt": "2026-01-28T12:00:00.000Z",
    "updatedAt": "2026-01-28T12:00:00.000Z"
  }'

# Get all expenses
curl https://your-api-domain.com/api/v1/expenses

# Delete expense
curl -X DELETE https://your-api-domain.com/api/v1/expenses/exp_test_123
```

## Next Steps

1. Choose your backend platform
2. Implement the API endpoints
3. Add authentication
4. Deploy to production
5. Update the sync adapter in mobile and desktop apps
6. Test synchronization across devices
