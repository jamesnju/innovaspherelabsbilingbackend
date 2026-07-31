 Core Concepts
1. Controllers
Controllers are the handlers that process incoming requests and return responses. They contain the business logic for each endpoint.

Role:

Receive validated data from routes

Interact with the database (via Prisma)

Process business logic

Return formatted responses to the client

Example:

typescript
// AuthController handles authentication logic
class AuthController {
  async login(req, res) {
    // 1. Get credentials from request
    // 2. Validate user in database
    // 3. Generate JWT token
    // 4. Return user data + token
  }
}
2. Middlewares
Middlewares are functions that execute between the request and the controller. They run before the controller logic.

Role:

Authentication/Authorization

Request validation

Logging

Error handling

Rate limiting

Example:

typescript
// authMiddleware checks if user is authenticated
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // Verify token...
  req.user = decodedUser;
  next(); // Pass control to the controller
}
3. Routes
Routes define the API endpoints and map them to controllers. They organize the API structure.

Role:

Define URL paths

Map HTTP methods (GET, POST, PUT, DELETE)

Apply middlewares

Connect to controllers

Example:

typescript
router.post('/login', validate(loginSchema), authController.login);
// POST /api/v1/auth/login → validate → authController.login
🔄 How APIs Work - Flow Diagram
text
Client Request
      ↓
   Route (URL + Method)
      ↓
  Middleware Chain (Validation, Auth, etc.)
      ↓
    Controller
      ↓
  Database (Prisma)
      ↓
    Response
      ↓
   Client