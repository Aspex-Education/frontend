import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';
import { environment } from 'src/environments/environment';

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

  it('should perform login and store token', () => {
    const mockResp = { token: 'abc', name: 'Juan', email: 'juan@example.com', message: 'Login successful' };
    service.login({ email: 'juan@example.com', password: 'secret' }).subscribe(resp => {
      expect(resp.token).toBe('abc');
      const stored = tokenStorage.getUser();
      expect(stored?.token).toBe('abc');
    });

    const req = httpMock.expectOne(`${environment.apiAuthUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResp);
  });
});
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
