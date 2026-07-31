// src/services/token.service.ts
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  role: string;
  clientId: string;
}

export class TokenService {
  generateToken(userId: string, role: string, clientId: string): string {
    const payload: TokenPayload = { userId, role, clientId };
    
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback-secret-key-not-for-production',
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      const secret = process.env.JWT_SECRET || 'fallback-secret-key-not-for-production';
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  generateRefreshToken(userId: string, role: string, clientId: string): string {
    const payload: TokenPayload = { userId, role, clientId };
    
    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-not-for-production',
      { expiresIn: '30d' }
    );
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const secret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-not-for-production';
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}

// Export a singleton instance
export const tokenService = new TokenService();

// Also export individual functions for convenience
export const generateToken = (userId: string, role: string, clientId: string): string => {
  return tokenService.generateToken(userId, role, clientId);
};

export const verifyToken = (token: string): TokenPayload | null => {
  return tokenService.verifyToken(token);
};