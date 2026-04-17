export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  name: string;
  email: string;
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription?: string;
}

export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  path: string;
}
