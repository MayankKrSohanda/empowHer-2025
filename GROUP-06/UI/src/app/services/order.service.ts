import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  
  private baseUrl = 'http://localhost:8080/api/orders'; // your backend endpoint

  constructor(private http: HttpClient) { }

  placeOrder(order: any,userId:number): Observable<any> {
    return this.http.post(`${this.baseUrl}?userId=${userId}`, order); // POST request
  }
  getUserOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
