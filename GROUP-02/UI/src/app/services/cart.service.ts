import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) {}

  addToCart(userId: number, productId: number, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { userId, productId, quantity });
  }

getCart(userId: number): Observable<CartItem[]> {
  return this.http.get<CartItem[]>(`${this.apiUrl}/${userId}`);
}


 removeFromCart(cartId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/remove/${cartId}`);
}


  clearCart(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`);
  }

  updateQuantity(cartId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/update/${cartId}?quantity=${quantity}`, {});
  }
}
