 Get Current Subscription
Endpoint: GET /api/v1/subscriptions/current

Purpose: Get the current subscription details for the authenticated client.

Headers: Authorization: Bearer <token>

Response (Success - 200):

json
{
  "success": true,
  "data": {
    "id": "sub1234567890",
    "plan": "PREMIUM",
    "status": "ACTIVE",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.000Z",
    "autoRenew": true,
    "billingCycle": "MONTHLY",
    "price": 49,
    "currency": "USD",
    "subscriptionProducts": [
      {
        "id": "sp1234567890",
        "product": {
          "id": "prod1234567890",
          "name": "POS System",
          "type": "POS"
        }
      },
      {
        "id": "sp1234567891",
        "product": {
          "id": "prod1234567891",
          "name": "E-commerce",
          "type": "ECOMMERCE"
        }
      }
    ]
  }
}
📌 Update Subscription
Endpoint: PUT /api/v1/subscriptions/update

Purpose: Update subscription settings (plan, auto-renew, billing cycle).

Headers: Authorization: Bearer <token>

Request:

json
{
  "plan": "PREMIUM",
  "autoRenew": true,
  "billingCycle": "MONTHLY",
  "productIds": ["prod1234567890", "prod1234567891"]
}
Response (Success - 200):

json
{
  "success": true,
  "message": "Subscription updated successfully",
  "data": {
    "id": "sub1234567890",
    "plan": "PREMIUM",
    "status": "ACTIVE",
    "autoRenew": true,
    "billingCycle": "MONTHLY",
    "price": 49
  }
}
📌 Upgrade Plan
Endpoint: POST /api/v1/subscriptions/upgrade

Purpose: Upgrade to a higher tier plan.

Headers: Authorization: Bearer <token>

Request:

json
{
  "plan": "PREMIUM"
}
Response (Success - 200):

json
{
  "success": true,
  "message": "Plan upgraded to PREMIUM successfully",
  "data": {
    "id": "sub1234567890",
    "plan": "PREMIUM",
    "status": "ACTIVE",
    "price": 49,
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.000Z"
  }
}
Response (Error - 400):

json
{
  "success": false,
  "error": "Plan must be upgraded to a higher tier"
}
📌 Get Available Plans
Endpoint: GET /api/v1/subscriptions/plans

Purpose: Get all available subscription plans with pricing.

Headers: Authorization: Bearer <token>

Response (Success - 200):

json
{
  "success": true,
  "data": [
    {
      "id": "FREE",
      "name": "Free",
      "description": "Perfect for getting started",
      "price": 0,
      "currency": "USD",
      "features": [
        "Basic POS System",
        "Up to 10 Products",
        "1 User",
        "Basic Reports",
        "Email Support"
      ],
      "isPopular": false
    },
    {
      "id": "BASIC",
      "name": "Basic",
      "description": "Great for small businesses",
      "price": 29,
      "currency": "USD",
      "features": [
        "Full POS System",
        "Unlimited Products",
        "Up to 5 Users",
        "Advanced Reports",
        "Inventory Management",
        "Email & Chat Support"
      ],
      "isPopular": true
    },
    {
      "id": "PREMIUM",
      "name": "Premium",
      "description": "For growing businesses",
      "price": 49,
      "currency": "USD",
      "features": [
        "Full POS System",
        "E-commerce Platform",
        "Unlimited Products",
        "Unlimited Users",
        "Advanced Analytics",
        "Inventory Management",
        "Offline Mode",
        "Priority Support",
        "API Access"
      ],
      "isPopular": false
    }
  ]
}