// src/types/index.ts
import { type Request, type Response } from 'express';
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    clientId: string;
    client?: any;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}