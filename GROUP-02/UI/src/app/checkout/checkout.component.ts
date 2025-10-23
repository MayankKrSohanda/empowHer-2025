import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../services/cart.service';
import { OrderService } from '../services/order.service';
declare var confetti: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;

  checkoutData = {
    contactNumber: '',
    address: '',
    paymentMethod: 'COD'
  };

  userId = 0;

  // Toast/confirmation message
  orderPlacedMessage: string = '';
  showOrderPlaced: boolean = false;

  constructor(private cartService: CartService, private orderService: OrderService) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = +storedUserId;
      this.cartService.getCart(this.userId).subscribe((data) => {
        this.items = data;
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      });
    }
  }

  placeOrder() {
    if (!this.items.length) {
      this.showToast('❌ Cart is empty! Add items first.', 'danger');
      return;
    }

    const orderPayload = {
      userId: this.userId,
      contactNumber: this.checkoutData.contactNumber,
      address: this.checkoutData.address,
      paymentMethod: this.checkoutData.paymentMethod,
      items: this.items.map(i => ({
        productId: i.productId,
        productName: i.productName,
        price: i.price,
        quantity: i.quantity
      })),
      total: this.total
    };

    this.orderService.placeOrder(orderPayload).subscribe(
      () => {
        // Clear cart
        this.cartService.clearCart(this.userId).subscribe(() => {
          this.items = [];
          this.total = 0;
        });

        this.showToast('✅ Order placed successfully!', 'success');

        // Confetti
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      },
      () => this.showToast('❌ Order failed! Please try again.', 'danger')
    );
  }

  // ✅ Add this method to fix the TS error
  showToast(message: string, type: 'success' | 'danger') {
    this.orderPlacedMessage = message;
    this.showOrderPlaced = true;

    setTimeout(() => {
      this.showOrderPlaced = false;
      this.orderPlacedMessage = '';
    }, 4000);
  }
}
