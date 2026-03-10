import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth.models';

const STORAGE_KEY = 'currentUser';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  saveUser(user: AuthResponse): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      // fallback: keep in-memory could be added; for now fail silently
      console.error('TokenStorage: unable to save user', e);
    }
  }

  getUser(): AuthResponse | null {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) as AuthResponse : null;
  }

  removeUser(): void {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  getToken(): string | null {
    return this.getUser()?.token || null;
  }
}
