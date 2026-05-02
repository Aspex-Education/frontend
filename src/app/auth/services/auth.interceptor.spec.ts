import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';
import { TokenStorageService } from './token-storage.service';
import { AuthService } from './auth.service';
import { Router, provideRouter } from '@angular/router';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let tokenStorage: TokenStorageService;
  let routerSpy: { navigate: jasmine.Spy };

  beforeEach(() => {
    routerSpy = { navigate: jasmine.createSpy('navigate') };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
        TokenStorageService,
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    tokenStorage = TestBed.inject(TokenStorageService);
  });

  afterEach(() => httpMock.verify());

  it('should add Authorization header when token exists', () => {
    tokenStorage.saveUser({ token: 'ttt', name: 'n', email: 'e', message: 'm' });
    http.get('/test').subscribe();
    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer ttt');
    req.flush({});
  });

  it('should handle 401, try refresh, and navigate to login on refresh failure', () => {
    tokenStorage.saveUser({ token: 'ttt', name: 'n', email: 'e', message: 'm' });
    http.get('/forbidden').subscribe({
      next: () => {},
      error: () => {}
    });
    
    // Original request fails with 401
    const req = httpMock.expectOne('/forbidden');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    
    // Interceptor should trigger refresh (POST /auth/refresh)
    const refreshReq = httpMock.expectOne(r => r.url.includes('/auth/refresh'));
    expect(refreshReq.request.method).toBe('POST');
    
    // Refresh fails too
    refreshReq.flush({ message: 'Refresh failed' }, { status: 401, statusText: 'Unauthorized' });
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
