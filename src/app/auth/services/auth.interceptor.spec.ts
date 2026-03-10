import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthInterceptor } from './auth.interceptor';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let tokenStorage: TokenStorageService;
  let routerSpy: { navigate: jasmine.Spy };

  beforeEach(() => {
    routerSpy = { navigate: jasmine.createSpy('navigate') };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TokenStorageService,
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

  it('should handle 401 and navigate to login', () => {
    tokenStorage.saveUser({ token: 'ttt', name: 'n', email: 'e', message: 'm' });
    http.get('/forbidden').subscribe({
      next: () => {},
      error: () => {}
    });
    const req = httpMock.expectOne('/forbidden');
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
