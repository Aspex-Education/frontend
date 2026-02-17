export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  username: string;
  email: string;
  message: string;
}

export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  path: string;
}
