import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenStorage: TokenStorageService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, TokenStorageService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenStorage = TestBed.inject(TokenStorageService);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform login and store token', () => {
    const mockResp = { token: 'abc', name: 'Juan', email: 'juan@example.com', message: 'Login successful' };
    service.login({ email: 'juan@example.com', password: 'secret' }).subscribe(resp => {
      expect(resp.token).toBe('abc');
      const stored = tokenStorage.getUser();
      expect(stored?.token).toBe('abc');
      expect(service.isLoggedIn()).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.apiAuthUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResp);
  });

  it('should perform register without storing token', () => {
    const mockResp = { token: undefined, name: 'Maria', email: 'maria@example.com', message: 'Registration successful' };
    service.register({ name: 'Maria', email: 'maria@example.com', password: 'password123' }).subscribe(resp => {
      expect(resp.message).toBe('Registration successful');
      // Register doesn't store token, login does
      expect(service.isLoggedIn()).toBe(false);
    });

    const req = httpMock.expectOne(`${environment.apiAuthUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResp);
  });

  it('should logout and remove token', () => {
    const mockUser = { token: 'abc', name: 'Juan', email: 'juan@example.com', message: 'ok' };
    tokenStorage.saveUser(mockUser);
    
    expect(service.isLoggedIn()).toBe(true);
    
    service.logout();
    
    expect(service.isLoggedIn()).toBe(false);
    expect(tokenStorage.getToken()).toBeNull();
  });

  it('should return token when logged in', () => {
    const mockUser = { token: 'testtoken', name: 'Test', email: 'test@example.com', message: 'ok' };
    tokenStorage.saveUser(mockUser);
    
    expect(service.getToken()).toBe('testtoken');
  });

  it('should return null when not logged in', () => {
    expect(service.getToken()).toBeNull();
  });
});

    expect(service).toBeTruthy();
  });
});
