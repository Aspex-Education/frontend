import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth.service';
import { AnalyticsService, AnalyticsEvent } from '../../core/services/analytics.service';
import { LoginRequest } from '../models/auth.models';
import { InputTextFieldComponent } from '../../shared/components/input-text-field';
import { ActionButtonComponent } from '../../shared/components/action-button';

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, RouterLink, InputTextFieldComponent, ActionButtonComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  private destroyRef = inject(DestroyRef);
  
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  companyName = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private analyticsService: AnalyticsService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Try to load a company name from assets (user can place a file at /assets/company/company-name.txt)
    fetch('/assets/company/company-name.txt')
      .then(r => r.ok ? r.text() : '')
      .then(text => this.companyName = text ? text.trim() : '')
      .catch(() => this.companyName = '');
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(loginRequest).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.analyticsService.trackEvent(AnalyticsEvent.LOGIN_SUCCESS, { method: 'email' });
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al iniciar sesión. Intenta nuevamente.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
