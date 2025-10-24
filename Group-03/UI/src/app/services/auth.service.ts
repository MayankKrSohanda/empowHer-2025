import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/login';
  private USER_KEY = 'loggedInUser';

  constructor(private http: HttpClient) {}

  // ✅ login API and store userId in localStorage
  login(u: User): Observable<any> {
    return this.http.post<any>(this.apiUrl, u).pipe(
      tap((res) => {
        if (res && res.userId) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(res));
        }
      })
    );
  }
  signUp(u: User): Observable<any> {
    const url = 'http://localhost:8080/api/signup';
    return this.http.post<any>(url, u,);
  }

  getLoggedInUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // ✅ get logged in userId
  getLoggedInUserId(): number | null {
    return this.getLoggedInUser()?.userId || null;
  }
  getUserName(): string | null {
    return this.getLoggedInUser()?.name || null;
  }
  getRole(): string | null {
    return this.getLoggedInUser()?.role || null;
  }

  isAdmin(): boolean {
    return this.getRole()?.toLowerCase() === 'admin';
  }

  // ✅ check login status
  isLoggedIn(): boolean {
    return this.getLoggedInUserId() !== null;
  }

  // ✅ logout
  logout(): void {
    localStorage.removeItem(this.USER_KEY);
  }
}
