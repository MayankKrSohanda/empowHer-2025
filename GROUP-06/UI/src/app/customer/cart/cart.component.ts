import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/model/CartItem';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: CartItem[] = [];
  userId = 1; // Replace with actual userId from AuthService

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartItems(this.userId).subscribe({
      next: items => this.cartItems = items,
      error: err => console.error('Failed to load cart:', err)
    });
  }

  removeFromCart(productId: number) {
    this.cartService.removeCartItem(this.userId, productId).subscribe({
      next: () => this.loadCart(), // refresh after removal
      error: err => console.error('Failed to remove item:', err)
    });
  }

  toOrderDetail() {
    this.router.navigate(['customer/order-detail']);
  }

  
}
