Get Invoices
Endpoint: GET /api/v1/billing/invoices

Purpose: Get all invoices for the authenticated client.

Headers: Authorization: Bearer <token>

Query Parameters:

page (optional): Page number (default: 1)

limit (optional): Items per page (default: 10)

status (optional): Filter by status (PENDING, COMPLETED, FAILED)

Response (Success - 200):

json
{
  "success": true,
  "data": [
    {
      "id": "inv1234567890",
      "invoiceNumber": "INV-1700000000000",
      "amount": 49,
      "currency": "USD",
      "status": "COMPLETED",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "paidAt": "2024-01-10T00:00:00.000Z",
      "items": [
        {
          "description": "Premium Plan - Monthly",
          "quantity": 1,
          "unitPrice": 49,
          "total": 49
        }
      ],
      "payments": [
        {
          "id": "pay1234567890",
          "amount": 49,
          "method": "CARD",
          "status": "COMPLETED"
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
📌 Get Invoice by ID
Endpoint: GET /api/v1/billing/invoices/:id

Purpose: Get a specific invoice by ID.

Headers: Authorization: Bearer <token>

Response (Success - 200):

json
{
  "success": true,
  "data": {
    "id": "inv1234567890",
    "invoiceNumber": "INV-1700000000000",
    "amount": 49,
    "currency": "USD",
    "status": "COMPLETED",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "paidAt": "2024-01-10T00:00:00.000Z",
    "items": [
      {
        "description": "Premium Plan - Monthly",
        "quantity": 1,
        "unitPrice": 49,
        "total": 49
      }
    ],
    "payments": [
      {
        "id": "pay1234567890",
        "amount": 49,
        "method": "CARD",
        "status": "COMPLETED"
      }
    ],
    "subscription": {
      "id": "sub1234567890",
      "plan": "PREMIUM",
      "subscriptionProducts": [
        {
          "product": {
            "name": "POS System",
            "type": "POS"
          }
        }
      ]
    }
  }
}
📌 Create Payment
Endpoint: POST /api/v1/billing/payments

Purpose: Process a payment for an invoice.

Headers: Authorization: Bearer <token>

Request:

json
{
  "invoiceId": "inv1234567890",
  "amount": 49,
  "currency": "USD",
  "method": "CARD",
  "reference": "PAY-REF-12345"
}
Response (Success - 200):

json
{
  "success": true,
  "message": "Payment completed successfully",
  "data": {
    "id": "pay1234567890",
    "invoiceId": "inv1234567890",
    "amount": 49,
    "currency": "USD",
    "method": "CARD",
    "status": "COMPLETED",
    "paymentId": "PAY-1700000000000"
  }
}
📌 Get Billing Summary
Endpoint: GET /api/v1/billing/summary

Purpose: Get a summary of billing information (pending invoices, total paid, etc.).

Headers: Authorization: Bearer <token>

Response (Success - 200):

json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub1234567890",
      "plan": "PREMIUM",
      "status": "ACTIVE"
    },
    "pendingInvoices": 1,
    "pendingAmount": 49,
    "totalPaid": 245,
    "lastInvoice": {
      "id": "inv1234567890",
      "invoiceNumber": "INV-1700000000000",
      "amount": 49,
      "status": "PENDING",
      "dueDate": "2024-01-15T00:00:00.000Z"
    }
  }
}