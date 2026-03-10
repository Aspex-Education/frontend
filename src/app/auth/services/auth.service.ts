import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, switchMap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiAuthUrl}/auth`;
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private router: Router) {
    const storedUser = this.tokenStorage.getUser();
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(
      storedUser
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    // Register endpoint doesn't return a token, just user info and message
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  /**
   * Register the user and then automatically login with the same credentials.
   * Chains register() and login() using switchMap and returns the login response.
   */
  registerAndLogin(request: RegisterRequest): Observable<AuthResponse> {
    return this.register(request).pipe(
      switchMap(() => this.login({ email: request.email, password: request.password }))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        if (response.token) {
          this.tokenStorage.saveUser(response);
          this.currentUserSubject.next(response);
        }
      })
    );
  }

  logout(): void {
    this.tokenStorage.removeUser();
    this.currentUserSubject.next(null);
    try {
      this.router.navigate(['/auth/login']);
    } catch (e) {
      console.warn('AuthService.logout: navigation failed', e);
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue?.token;
  }

  getToken(): string | null {
    return this.currentUserValue?.token || null;
  }
}
