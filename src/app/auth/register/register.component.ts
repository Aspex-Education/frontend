import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth.service';
import { AnalyticsService, AnalyticsEvent } from '../../core/services/analytics.service';
import { RegisterRequest } from '../models/auth.models';
import { InputTextFieldComponent } from '../../shared/components/input-text-field';
import { ActionButtonComponent } from '../../shared/components/action-button';

@Component({
    selector: 'app-register',
    imports: [CommonModule, ReactiveFormsModule, RouterLink, InputTextFieldComponent, ActionButtonComponent],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
  private destroyRef = inject(DestroyRef);
  
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  companyName = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private analyticsService: AnalyticsService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    fetch('/assets/company/company-name.txt')
      .then(r => r.ok ? r.text() : '')
      .then(text => this.companyName = text ? text.trim() : '')
      .catch(() => this.companyName = '');
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerRequest: RegisterRequest = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.registerAndLogin(registerRequest).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (loginResponse) => {
        // Registration + login successful
        this.analyticsService.trackEvent(AnalyticsEvent.SIGN_UP_SUCCESS, { method: 'email' });
        this.analyticsService.trackEvent(AnalyticsEvent.LOGIN_SUCCESS, { method: 'email' });
        this.successMessage = loginResponse.message || 'Registro exitoso. Redirigiendo...';
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        // Either registration or automatic login failed
        this.errorMessage = error.error?.message || 'Error en el registro o inicio de sesión automático. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }
}
