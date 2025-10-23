import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  // 🔹 Place an order
  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/place`, orderData);
  }

  // 🔹 Get all orders for a user
  getOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map(orders =>
        orders.map(order => ({
          ...order,
          // 👇 rename createdAt → date so template works
          date: order.createdAt
        }))
      )
    );
  }

  // 🔹 Get order details by ID
  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`).pipe(
      map(order => ({
        ...order,
        date: order.createdAt
      }))
    );
  }
}
