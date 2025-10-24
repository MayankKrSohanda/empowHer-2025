import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { CartItem } from '../model/cart-item';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css'],
})
export class OrderReviewComponent implements OnInit {
  cartItems: CartItem[] = [];
  address = '';
  phone = '';
  orderNotes = '';
  paymentMethod = '';
  cardDetails: { cardNumber: string; expiry: string; cvv: string } | null = null;
  totalAmount = 0;
  estimatedDelivery = '';
  isProcessingPayment = false;

  // Toast message variables
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const navState = history.state;

    this.cartItems = navState.cartItems || [];
    this.address = navState.address || '';
    this.phone = navState.phone || '';
    this.orderNotes = navState.orderNotes || '';
    this.paymentMethod = navState.paymentMethod || '';
    this.cardDetails = navState.cardDetails || null;
    this.totalAmount = navState.totalAmount || 0;
    this.estimatedDelivery = navState.estimatedDelivery || '';
  }

  maskCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), 3000);
  }

  placeOrPay() {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) return;

    const orderPayload = {
      totalPrice: this.totalAmount,
      orderStatus: 'PLACED',
      paymentStatus:
        this.paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'PAID',
      deliveryAddress: this.address,
      phoneNumber: this.phone,
      paymentMethod: this.paymentMethod,
      orderNotes: this.orderNotes,
      items: this.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.productPrice,
      })),
    };

    this.isProcessingPayment = true;

    this.orderService.placeOrder(userId, orderPayload).subscribe({
      next: (order) => {
        if (this.paymentMethod === 'Cash on Delivery') {
          // this.isProcessingPayment = false;
          this.showToast('Order placed successfully!', 'success');
          setTimeout(() => {
            this.router.navigate(['/payment-success'], {
              state: { orderId: order.id, amount: order.totalPrice },
            });
          }, 1200);
        } else {
          // Simulate payment delay
          setTimeout(() => {
            this.orderService.markOrderPaid(userId, order.orderId).subscribe({
              next: () => {
                this.isProcessingPayment = false;
                this.showToast('Payment successful! Redirecting...', 'success');
                setTimeout(() => {
                  this.router.navigate(['/payment-success'], {
                    state: { orderId: order.orderId, amount: order.totalPrice },
                  });
                }, 1500);
              },
              error: () => {
                this.isProcessingPayment = false;
                this.showToast('Payment failed! Try again.', 'error');
              },
            });
          }, 2500);
        }
      },
      error: (err) => {
        console.error(err);
        this.isProcessingPayment = false;
        this.showToast('Order failed! Try again.', 'error');
      },
    });
  }
}
