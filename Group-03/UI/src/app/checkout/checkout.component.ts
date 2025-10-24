import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartItem } from '../model/cart-item';
import { CartService } from '../services/cart.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  address: string = '';
  phone: string = '';
  orderNotes: string = '';
  discountCode: string = '';
  estimatedDelivery: string = '';
  paymentMethod: string = '';
  cardNumber: string = '';
  expiry: string = '';
  cvv: string = '';

  paymentOptions: string[] = ['Cash on Delivery', 'UPI', 'Card'];

  constructor(
    // private orderService: OrderService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.setEstimatedDelivery();
  }

  loadCart() {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) return;

    this.cartService.getCartItems(userId).subscribe({
      next: (items) => (this.cartItems = items),
      error: () => console.error('Failed to load cart'),
    });
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.productPrice * (item.quantity || 1),
      0
    );
  }

  setEstimatedDelivery() {
    const today = new Date();
    today.setDate(today.getDate() + 5); // +5 days delivery
    this.estimatedDelivery = today.toDateString();
  }

  applyDiscount() {
    if (this.discountCode === 'SAVE10') {
      alert('Discount applied: 10% off!');
    } else {
      alert('Invalid discount code!');
    }
  }
  continueToReview() {
    if (!this.address.trim() || !this.phone.trim()) {
      alert('Please provide delivery address and phone number!');
      return;
    }

    if (!/^[0-9]{10}$/.test(this.phone)) {
      alert('Please enter a valid 10-digit phone number!');
      return;
    }
    if (!this.paymentMethod) {
      alert('Please select a payment method!');
      return;
    }
    if (this.paymentMethod === 'Card') {
      if (!/^\d{16}$/.test(this.cardNumber)) {
        alert('Enter valid 16-digit card number');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(this.expiry)) {
        alert('Enter valid expiry MM/YY');
        return;
      }
      if (!/^\d{3,4}$/.test(this.cvv)) {
        alert('Enter valid CVV');
        return;
      }
    }
    // Navigate to review page with state
    this.router.navigate(['/order-review'], {
      state: {
        cartItems: this.cartItems,
        address: this.address.trim(),
        phone: this.phone.trim(),
        orderNotes: this.orderNotes?.trim() || 'No notes provided',
        paymentMethod: this.paymentMethod,
        cardDetails: {
          cardNumber: this.cardNumber,
          expiry: this.expiry,
          cvv: this.cvv,
        },
        totalAmount: this.getTotal(),
        estimatedDelivery: this.estimatedDelivery,
      },
    });
  }

}
