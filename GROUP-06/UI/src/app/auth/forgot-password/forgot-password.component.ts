import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (this.email) {
      this.http.post<any>('http://localhost:8080/api/auth/forgot-password', { email: this.email })
        .subscribe({
          next: (response) => {
            this.message = response.message || 'Reset link sent successfully!';
          },
          error: (error) => {
            this.message = error.error.message || 'Something went wrong!';
          }
        });
    }
  }
}
