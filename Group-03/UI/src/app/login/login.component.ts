import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loginError: string = '';
  loginSuccess: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/),
        ],
      ],
    });
  }

  // getter for easy access in template
  get f() {
    return this.loginForm.controls;
  }

  handleLogin(): void {
    this.submitted = true;
    this.loginError = '';
    this.loginSuccess = '';

    if (this.loginForm.invalid) {
      return;
    }

    const user: User = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(user).subscribe({
      next: (res) => {
        // Backend must return { userId, token, ... }
        if (res && res.userId) {
          this.loginSuccess = 'Login Successfull';

          setTimeout(() => {
            if (this.authService.isAdmin()) {
              console.log(this.authService.isAdmin());
              this.router.navigateByUrl('/admin');
            } else {
              this.router.navigateByUrl('/home');
            }
          }, 1500);
        } else {
          this.loginError = 'Login failed: No userId returned';
        }
      },
      error: (err) => {
        console.error(err);
        this.loginError = 'Invalid email or password';
      },
    });
  }
}
