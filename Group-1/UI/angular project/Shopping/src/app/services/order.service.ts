import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetail } from '../model/order-detail';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  placeOrder(order: any): Observable<any> {
  return this.http.post<OrderDetail>("http://localhost:8080/api/orders/placeOrders", order);
}

  getOrdersByUser(userId: number): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(`${this.apiUrl}/${userId}`);
  }
  
}
