import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  signupSuccess: string = '';
  signupError: string = '';
  showPasswordMismatch: boolean = false;

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // ✅ getter for easy template access
  get f() {
    return this.signupForm.controls;
  }

  // ✅ Custom validator to check password match
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onConfirmPasswordBlur() {
    const password = this.f['password'].value;
    const confirm = this.f['confirmPassword'].value;
    if (
      this.f['confirmPassword'].touched &&
      password &&
      confirm &&
      password !== confirm
    ) {
      this.showPasswordMismatch = true;
    } else {
      this.showPasswordMismatch = false;
    }
  }

  togglePassword(field: 'password' | 'confirm') {
    if (field === 'password') this.passwordVisible = !this.passwordVisible;
    else this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  handleSignup(): void {
    this.signupError = '';
    this.signupSuccess = '';

    if (this.signupForm.invalid) return;

    const newUser: User = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
    };

    // 🔗 Later we’ll connect this to backend
    this.authService.signUp(newUser).subscribe({
      next: (res) => {
        this.signupSuccess = res.message;
        setTimeout(() => this.router.navigateByUrl('/login'), 1500);
      },
      error: (err: any) => {
        if (err.status === 400) {
          this.signupError = err.error.message;
        } else {
          this.signupError = 'Registration failed.Try again.';
        }
      },
    });
  }
}
