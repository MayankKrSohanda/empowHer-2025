import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  user = {
    name: '',
    email: '',
    password: '',
    role: ''
  };
constructor(private http: HttpClient, private router: Router) {}

  onSignup() {
     const { name, email, password, role } = this.user;

    if (name && email && password && role) {
      this.http.post('http://localhost:8080/api/auth/signup', this.user).subscribe({
        next: (res: any) => {
          console.log('Signup success:', res);

          // Navigate to appropriate dashboard
          switch (role.toLowerCase()) {
            case 'admin':
              this.router.navigate(['/admin-dashboard']);
              break;
            case 'seller':
              this.router.navigate(['/seller-dashboard']);
              break;
            case 'customer':
              this.router.navigate(['/customer-dashboard']);
              break;
            default:
              this.router.navigate(['/']);
              break;
          }
        },
        error: (err: any) => {
          console.error('Signup error:', err);
          alert('Signup failed. Please try again.');
        }
      });
    } else {
      alert("Please fill out all fields.");
    }
  }
}
