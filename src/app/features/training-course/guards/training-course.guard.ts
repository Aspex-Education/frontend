import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FirebaseAcademyRepository } from '../services/firebase-academy.repository';
import { getUserEmailFromToken } from '../utils/auth-helper';

@Injectable({
  providedIn: 'root'
})
export class TrainingCourseGuard implements CanActivate {
  constructor(
    private firebaseRepo: FirebaseAcademyRepository,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    const email = getUserEmailFromToken();
    if (!email) {
      this.router.navigate(['/home']);
      return from(Promise.resolve(false));
    }

    return from(this.firebaseRepo.hasAccess(email)).pipe(
      map(hasAccess => {
        if (!hasAccess) {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/home']);
        return from(Promise.resolve(false));
      })
    );
  }
}