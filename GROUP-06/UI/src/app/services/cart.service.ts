import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../model/CartItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) { }

  // Get cart items for a specific user
  getCartItems(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.baseUrl}/${userId}`);
  }

  // Add item to cart
  addToCart(cartItemDTO: any) {
    return this.http.post(`${this.baseUrl}/add`, cartItemDTO);
  }

  // Remove cart item for a specific user (decrease quantity or delete)
  removeCartItem(userId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove/${userId}/${productId}`);
  }
}
