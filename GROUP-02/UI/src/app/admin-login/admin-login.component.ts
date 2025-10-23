import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'] // separate file
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  passwordError: string = '';
  private messageTimeout: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/)
      ]]
    });
  }

  ngOnInit() {
    // Real-time password validation
    this.loginForm.get('password')?.valueChanges.subscribe(value => {
      if (!value) {
        this.passwordError = '';
        return;
      }
      const missing = [];
      if (!/[A-Z]/.test(value)) missing.push('1 uppercase letter');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) missing.push('1 special character');
      if (value.length < 6) missing.push('minimum 6 characters');

      this.passwordError = missing.length ? `Password must include ${missing.join(', ')}.` : '';
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.showError('⚠️ Please fill in all fields correctly.');
      return;
    }

    this.clearMessages();
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        // Backend should send role
        if (res.role !== 'ADMIN') {
          this.showError('❌ You are not an admin.');
          this.loginForm.reset();
          return;
        }

        this.showSuccess('✅ Admin login successful! Redirecting...');
        setTimeout(() => this.router.navigate(['/admin/home']), 2000);
      },
      error: () => {
        this.showError('❌ Invalid credentials. Please try again.');
        this.loginForm.reset();
      }
    });
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.clearTimeoutIfExists();
    this.messageTimeout = setTimeout(() => (this.successMessage = ''), 5000);
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.clearTimeoutIfExists();
    this.messageTimeout = setTimeout(() => (this.errorMessage = ''), 5000);
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private clearTimeoutIfExists() {
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
  }
}
