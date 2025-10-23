import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8080/api/admin'; // Base URL for admin backend

  constructor(private http: HttpClient) {}

  // ✅ Dashboard stats
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  // ✅ Products
  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  

  updateOrderStatus(order: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/orders/${order.id}/status`, { status: order.status });
  }

  // ✅ Reports / Analytics
  getSalesData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports`);
  }
}
