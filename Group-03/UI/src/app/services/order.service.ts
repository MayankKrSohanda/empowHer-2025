import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  placeOrder(userId: number, orderPayload: any): Observable<Order> {
    return this.http.post<Order>(
      `${this.apiUrl}/placeOrder/${userId}`,
      orderPayload
    );
  }

  getOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/${userId}`);
  }
  markOrderPaid(userId: number, orderId: string): Observable<any> {
    console.log(`Mock payment success for user ${userId},order ${orderId}`);
    return of({ status: 'PAID', transactionId: 'TXN123456' });
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('http://localhost:8080/api/orders/all');
  }

  updateOrderStatus(id: number, status: string) {
  return this.http.put<Order>(`${this.apiUrl}/${id}/status`, status);
}

updatePaymentStatus(id: number, paymentStatus: string) {
  return this.http.put<Order>(`${this.apiUrl}/${id}/payment`, paymentStatus);
}


}
