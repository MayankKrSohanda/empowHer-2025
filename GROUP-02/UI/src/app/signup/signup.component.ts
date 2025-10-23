import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  successMessage: string = ''; // <-- in-page success message
  errorMessage: string = '';   // <-- in-page error message

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.signupForm.reset();
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    this.authService.register(this.signupForm.value).subscribe({
      next: () => {
        this.successMessage = '✅ Account created successfully! Please login.';
        // redirect to login after a short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: err => {
        this.errorMessage = err.error || '❌ Registration failed. Try again.';
      }
    });
  }
}
