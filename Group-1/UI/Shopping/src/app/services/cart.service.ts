import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../model/product";
import { Observable } from "rxjs";
import { AddToCartRequest } from "../model/addToCartRequest";
import { CartItem } from "../model/cartItem";

@Injectable({
    providedIn: 'root'
})

export class CartService{
 
  
    private apiUrl='http://localhost:8080/api/cart';

    private items: CartItem[] = [];
    constructor(private http: HttpClient){}


    addToCart(request: AddToCartRequest) {
  return this.http.post(`${this.apiUrl}/add`, request, { responseType: 'text' });
}

    
     getCartItems(userId: number):Observable<CartItem[]> {
      return this.http.get<CartItem[]>(`${this.apiUrl}/user/${userId}`);
    }

    removeItem(cartItemId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/remove/${cartItemId}`);
    }

   getCheckoutItems(): CartItem[] {
    return this.items;
  }
placeOrder(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/placeOrders/${userId}`, {});
  }

  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}`);
  }
}