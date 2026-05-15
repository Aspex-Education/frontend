import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const ADMIN_AUTH_FLAG = 'confex-admin-authenticated';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  login(password: string): boolean {
    const isValid = password?.trim() === environment.CONFEX_ADMIN_PASS;
    if (isValid) {
      sessionStorage.setItem(ADMIN_AUTH_FLAG, '1');
    }
    return isValid;
  }

  logout(): void {
    sessionStorage.removeItem(ADMIN_AUTH_FLAG);
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem(ADMIN_AUTH_FLAG) === '1';
  }
}
