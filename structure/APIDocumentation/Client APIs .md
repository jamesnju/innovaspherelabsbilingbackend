 Get All Clients
Endpoint: GET /api/v1/clients

Purpose: Get all clients (Super Admin only).

Headers: Authorization: Bearer <token>

Query Parameters:

page (optional): Page number

limit (optional): Items per page

search (optional): Search by name or email

status (optional): Filter by status

Response (Success - 200):

json
{
  "success": true,
  "data": [
    {
      "id": "cl1234567890",
      "name": "ABC Retail Store",
      "email": "john@example.com",
      "status": "ACTIVE",
      "category": "RETAIL",
      "subscription": {
        "plan": "PREMIUM",
        "status": "ACTIVE"
      },
      "_count": {
        "users": 3
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
📌 Get Client by ID
Endpoint: GET /api/v1/clients/:id

Purpose: Get detailed client information (Super Admin only).

Headers: Authorization: Bearer <token>

Response (Success - 200):

json
{
  "success": true,
  "data": {
    "id": "cl1234567890",
    "name": "ABC Retail Store",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "status": "ACTIVE",
    "category": "RETAIL",
    "users": [
      {
        "id": "cm1234567890",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "BUSINESS_OWNER",
        "status": "ACTIVE"
      }
    ],
    "subscription": {
      "id": "sub1234567890",
      "plan": "PREMIUM",
      "status": "ACTIVE"
    },
    "invoices": [],
    "customizations": {
      "theme": {},
      "branding": {}
    }
  }
}
📌 Update Client
Endpoint: PUT /api/v1/clients/:id

Purpose: Update client information (Super Admin only).

Headers: Authorization: Bearer <token>

Request:

json
{
  "name": "ABC Retail Store Updated",
  "phone": "+1234567891",
  "address": "456 New Street",
  "status": "ACTIVE",
  "category": "RETAIL"
}
Response (Success - 200):

json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "id": "cl1234567890",
    "name": "ABC Retail Store Updated",
    "email": "john@example.com",
    "phone": "+1234567891",
    "status": "ACTIVE"
  }
}
📌 Get Dashboard Stats
Endpoint: GET /api/v1/clients/dashboard/stats

Purpose: Get dashboard statistics for the authenticated client.

Headers: Authorization: Bearer <token>

Response (Success - 200):

json
{
  "success": true,
  "data": {
    "stats": {
      "users": 5,
      "products": 12,
      "invoices": 8,
      "pendingAmount": 147
    },
    "recentActivity": [
      {
        "id": "audit1234567890",
        "action": "LOGIN",
        "entityType": "User",
        "createdAt": "2024-01-01T10:00:00.000Z",
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ]
  }
}
