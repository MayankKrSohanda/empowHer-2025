import { Component, OnInit } from '@angular/core';
import { CartService} from '../services/cart.service';

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  userId: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = +storedUserId;
      this.loadCart();
    }
  }

  loadCart() {
    this.cartService.getCart(this.userId).subscribe(items => {
      this.cartItems = items;
    });
  }

  removeItem(cartId: number, event: Event) {
    event.stopPropagation();
    this.cartService.removeFromCart(cartId).subscribe(() => {
      this.loadCart();
    });
  }

  clearCart() {
    this.cartService.clearCart(this.userId).subscribe(() => {
      this.cartItems = [];
    });
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  increaseQuantity(item: CartItem) {
    const newQuantity = item.quantity + 1;
    this.cartService.updateQuantity(item.id, newQuantity).subscribe(updated => {
      item.quantity = updated.quantity;
    });
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      this.cartService.updateQuantity(item.id, newQuantity).subscribe(updated => {
        item.quantity = updated.quantity;
      });
    }
  }
}
