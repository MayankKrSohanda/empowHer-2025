
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/login';

  private userIdSubject = new BehaviorSubject<number | null>(null);
  private userEmailSubject = new BehaviorSubject<string | null>(null); // ✅ Added
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    // Load from localStorage on app start
    const savedId = localStorage.getItem('userId');
    const savedEmail = localStorage.getItem('email'); // ✅ Added
    const savedRole = localStorage.getItem('role');

    if (savedId) this.userIdSubject.next(Number(savedId));
    if (savedEmail) this.userEmailSubject.next(savedEmail); // ✅ Added
    if (savedRole) this.userRoleSubject.next(savedRole);
  }

  


   // ---------------- REGISTER ----------------
  register(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(this.apiUrl, user).pipe(
    tap(res => {
      if (res.id) localStorage.setItem('userId', res.id.toString());
      if (res.email) localStorage.setItem('email', res.email);
      if (res.name) localStorage.setItem('name', res.name); // ✅ Store name
      if (res.role) localStorage.setItem('role', res.role);

      this.userIdSubject.next(res.id);
      this.userEmailSubject.next(res.email);
      this.userRoleSubject.next(res.role);
    })
  );
  }

getCurrentUserName(): string | null {
  return localStorage.getItem('name'); // ✅ Getter for frontend
}




  // ✅ Implemented properly
  getCurrentUserEmail(): string | null {
    return this.userEmailSubject.value;
  }

  getCurrentUserId(): number | null {
    return this.userIdSubject.value;
  }

  getRole(): string | null {
    return this.userRoleSubject.value;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUserId() !== null;
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('email'); // ✅ Added
    this.userIdSubject.next(null);
    this.userRoleSubject.next(null);
    this.userEmailSubject.next(null); // ✅ Added
  }
}
