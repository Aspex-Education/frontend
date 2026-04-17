import { TestBed } from '@angular/core/testing';
import { TokenStorageService } from './token-storage.service';
import { AuthResponse } from '../models/auth.models';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [TokenStorageService] });
    service = TestBed.inject(TokenStorageService);
  });

  it('should save and retrieve user', () => {
    const user: AuthResponse = { token: 't', name: 'n', email: 'e', message: 'ok' };
    service.saveUser(user);
    const got = service.getUser();
    expect(got).toEqual(user);
    expect(service.getToken()).toBe('t');
  });

  it('should remove user', () => {
    const user: AuthResponse = { token: 't', name: 'n', email: 'e', message: 'ok' };
    service.saveUser(user);
    service.removeUser();
    expect(service.getUser()).toBeNull();
    expect(service.getToken()).toBeNull();
  });
});
