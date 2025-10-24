import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../model/cart-item';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:8080/api/cart';

  public cartItemSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemSubject.asObservable();

  constructor(private http: HttpClient) {}
  loadCart(userId: number) {
    this.getCartItems(userId).subscribe({
      next: (items: CartItem[]) => this.cartItemSubject.next(items),
      error: (err) => console.error('Failed to load cart', err),
    });
  }

  // ✅ Accept userId from caller (CardComponent)
  addToCart(
    userId: number,
    productId: number,
    quantity: number = 1
  ): Observable<any> {
    const body = {
      userId: userId,
      productId: productId,
      quantity: quantity,
    };
    return this.http
      .post(`${this.baseUrl}/add`, body)
      .pipe(tap(() => this.loadCart(userId)));
  }

  getCartItems(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  removeItem(userId: number, cartItemId: number): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/remove/${cartItemId}`)
      .pipe(tap(() => this.loadCart(userId)));
  }

  clearCart(userId: number): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/clear/${userId}`)
      .pipe(tap(() => this.cartItemSubject.next([])));
  }

  updateCartItemQuantity(
    userId: number,
    cartItemId: number,
    quantity: number
  ): Observable<any> {
    const body = { quantity, userId };
    return this.http
      .put(`${this.baseUrl}/update/${cartItemId}`, body)
      .pipe(tap(() => this.loadCart(userId)));
  }
}
