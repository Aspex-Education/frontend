import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap, catchError, of } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiAuthUrl}/auth`;
  private userApiUrl = `${environment.apiAuthUrl}/users`;
  private currentUserSignal = signal<AuthResponse | null>(null);
  private userProfileSignal = signal<User | null>(null);
  
  public currentUser = computed(() => this.currentUserSignal());
  public userProfile = computed(() => this.userProfileSignal());
  
  public currentUserId = computed(() => {
    const token = this.currentUserSignal()?.token;
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.userId || decoded.sub || null;
    } catch {
      return null;
    }
  });

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService, private router: Router) {
    const storedUser = this.tokenStorage.getUser();
    if (storedUser) {
      this.currentUserSignal.set(storedUser);
    }
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSignal();
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  registerAndLogin(request: RegisterRequest): Observable<AuthResponse> {
    return this.register(request).pipe(
      switchMap(() => this.login({ email: request.email, password: request.password }))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request, { withCredentials: true }).pipe(
      tap(response => {
        if (response.token) {
          this.tokenStorage.saveUser(response);
          this.currentUserSignal.set(response);
        }
      })
    );
  }

  refresh(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap(response => {
        if (response.token) {
          const current = this.tokenStorage.getUser();
          const updated = { ...current, ...response };
          this.tokenStorage.saveUser(updated);
          this.currentUserSignal.set(updated);
        }
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      catchError(() => of(true))
    ).subscribe(() => {
      this.clearSession();
    });
  }

  clearSession(): void {
    this.tokenStorage.removeUser();
    this.currentUserSignal.set(null);
    try {
      this.router.navigate(['/auth/login']);
    } catch (e) {
      console.warn('AuthService.clearSession: navigation failed', e);
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSignal()?.token;
  }

  getToken(): string | null {
    return this.currentUserSignal()?.token || null;
  }

  getUserProfile(): Observable<User | null> {
    const userId = this.currentUserId();
    if (!userId) return of(null);

    return this.http.get<User>(`${this.userApiUrl}/${userId}`).pipe(
      tap(user => this.userProfileSignal.set(user)),
      catchError(() => of(null))
    );
  }

  hasPremiumAccess(): boolean {
    const profile = this.userProfileSignal();
return profile?.plan === 'TALLER_UNIPERSONAL'; 
  }
}
