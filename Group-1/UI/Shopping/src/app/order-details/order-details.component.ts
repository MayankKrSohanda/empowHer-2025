import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { CartItem } from '../model/cartItem';
import { OrderRequestDTO } from '../model/orderRequest';
import { OrderDetail } from '../model/order-detail';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];

  userName: string = '';
  contact: string = '';
  deliveryAddress: string = '';
  paymentMethod: string = '';
  alertMessage:string|null=null;
  alertType:'success'|'danger'='success';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    const userId = 1; 
    this.cartService.getCartItems(userId).subscribe({
      next: (items) => {
        this.cartItems = items;
      },
      error: (err) => console.error('Error fetching cart items', err)
    });
  }

  removeFromCart(cartItemId: number): void {
    this.cartService.removeItem(cartItemId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.cartItemId !== cartItemId);
      },
      error: (err) => console.error('Error removing item', err)
    });
  }

  totalAmount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  trackByProductId(index: number, item: CartItem): number {
    return item.productId;
  }

  placeOrder(): void {
    if (!this.userName || !this.contact || !this.deliveryAddress || !this.paymentMethod) {
      this.alertType='danger';
      this.alertMessage="Please fill all required fields";
      setTimeout(()=>this.alertMessage=null,3000);
      return;
    }

    const orderRequest: OrderRequestDTO = {
      userId: 1, 
      deliveryAddress: this.deliveryAddress,
      items: this.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.orderService.placeOrder(orderRequest).subscribe({
      next: (order: OrderDetail) => {
        this.alertType='success';
      this.alertMessage="Order placed successfully";
      setTimeout(()=>this.alertMessage=null,3000);
        console.log('Order placed successfully', order);
        this.router.navigateByUrl('/order-details', { state: { order } });
      },
      error: (err) => {
        this.alertType='danger';
      this.alertMessage="Error placing order";
      setTimeout(()=>this.alertMessage=null,3000);
        console.error('Error placing order', err)
      }
    });
  }

  formatPrice(value: number): string {
    return value.toFixed(2); 
  }

}
