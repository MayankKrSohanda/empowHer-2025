import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  // Adjust this URL to exactly match your backend
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient,private router:Router) {}

  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user);
  }
  logout(): void {
    // Clear all session info
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole'); // if stored
    // Redirect to login page
    this.router.navigate(['/auth/login']);
  }
}
