import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/model/CartItem';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];

  order = {
     userId: 1, 
    orderDate: new Date().toISOString().split('T')[0], // yyyy-mm-dd
    deliveryAddress: '',
     totalAmount: 0,
       status: 'Pending',
    phone: '',
    paymentMode: '',
   
  
   // Replace with actual logged-in user ID
    
  };

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  // Load items from cart
  loadCartItems() {
    this.cartService.getCartItems(this.order.userId).subscribe({
      next: (items) => {
        this.cartItems = items;
        console.log('Cart items loaded:', this.cartItems);
      },
      error: (error) => console.error('Error loading cart items', error)
    });
  }

  // Calculate total amount
  getTotalAmount(): number {
    return this.cartItems.reduce((sum, item) => {
      const price = item.product?.price ?? 0; // fallback if price is missing
      return sum + price * item.quantity;
    }, 0);
  }

  // Place order
 placeOrder(form: NgForm) {
  if (form.invalid) return;

  const orderPayload = {
    userId: this.order.userId,
    orderDate: this.order.orderDate,
    deliveryAddress: this.order.deliveryAddress,
    totalAmount: this.getTotalAmount(),
    status: this.order.status,
    orderProducts: this.cartItems
      .filter(item => item.product && item.product.productId != null) // ensure product exists
      .map(item => ({
        productId: item.product.productId, // use productId from Product
        quantity: item.quantity,price: item.product.price
      }))
  };

  console.log('Form data to send:', orderPayload);

  this.http.post(`http://localhost:8080/api/orders?userId=${this.order.userId}`, orderPayload)
    .subscribe({
      next: (response) => {
         alert('Order placed successfully')
        console.log('Order placed successfully', response);
        this.router.navigate(['/order-success']); // redirect after success
      },
      error: (error: HttpErrorResponse) => console.error('Error placing order', error)
    });
}

}
