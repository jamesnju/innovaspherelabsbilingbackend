1. Authentication APIs
📌 Register - Create New Account
Endpoint: POST /api/v1/auth/register

Purpose: Create a new business account with a business owner user.

Request:

json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "companyName": "ABC Retail Store",
  "phone": "+1234567890"
}
Response (Success - 201):

json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "cm1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "BUSINESS_OWNER"
    },
    "client": {
      "id": "cl1234567890",
      "name": "ABC Retail Store",
      "email": "john@example.com"
    },
    "subscription": {
      "id": "sub1234567890",
      "plan": "FREE",
      "status": "ACTIVE"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
Response (Error - 400):

json
{
  "success": false,
  "error": "User with this email already exists"
}
📌 Login - Authenticate User
Endpoint: POST /api/v1/auth/login

Purpose: Authenticate a user and return access token.

Request:

json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
Response (Success - 200):

json
{
  "success": true,
  "data": {
    "user": {
      "id": "cm1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "BUSINESS_OWNER",
      "status": "ACTIVE"
    },
    "client": {
      "id": "cl1234567890",
      "name": "ABC Retail Store",
      "email": "john@example.com",
      "subscription": {
        "id": "sub1234567890",
        "plan": "FREE",
        "status": "ACTIVE"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
Response (Error - 401):

json
{
  "success": false,
  "error": "Invalid credentials"
}
📌 Get Current User
Endpoint: GET /api/v1/auth/me

Purpose: Get the currently authenticated user's details.

Headers: Authorization: Bearer <token>

Response (Success - 200):

json
{
  "success": true,
  "data": {
    "id": "cm1234567890",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "BUSINESS_OWNER",
    "status": "ACTIVE",
    "client": {
      "id": "cl1234567890",
      "name": "ABC Retail Store",
      "subscription": {
        "plan": "FREE",
        "status": "ACTIVE"
      }
    },
    "userPreferences": {
      "theme": "light",
      "language": "en"
    }
  }
}
