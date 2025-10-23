import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: number;           // Primary key in manage_orders table
  orderId: number;      // Actual order reference ID (used in backend endpoints)
  totalPrice: number;
  status: string;
  deliveryDate?: string;
  customerName?: string;
  orderItems?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ManageOrdersService {

  private baseUrl = 'http://localhost:8080/manage-orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}`);
  }

  shipOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/ship`, {});
  }

  deliverOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/deliver`, {});
  }

  getWeeklyEarnings(): Observable<{ [week: number]: number }> {
    return this.http.get<{ [week: number]: number }>(`${this.baseUrl}/weekly-earnings`);
  }
}
