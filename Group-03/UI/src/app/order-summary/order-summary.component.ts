import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { Order } from '../model/order';
import { Product } from '../model/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
})
export class OrderSummaryComponent implements OnInit {
  orders: Order[] = [];
  products: Product[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Load products
    this.productService.products$.subscribe((data) => {
      this.products = data;
    });
    if (this.products.length === 0) {
      this.productService.getProducts().subscribe();
    }

    // Load user orders
    this.fetchOrders();
  }

  fetchOrders(): void {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) return;

    this.loading = true;

    this.orderService.getOrders(userId).subscribe({
      next: (data) => {
        // Add showDetails property for UI toggling
        this.orders = data.map((order) => ({ ...order, showDetails: false }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch orders', err);
        this.errorMessage =
          'Failed to load order history. Please try again later.';
        this.loading = false;
      },
    });
  }

  getProductName(productId: number): string {
    const product = this.products.find((p) => p.id === productId);
    return product ? product.title : 'Unknown Product';
  }

  getUserName(): string {
    return this.authService.getUserName() || 'Unknown User';
  }

  toggleDetails(order: Order): void {
    order.showDetails = !order.showDetails;
  }

  /** UI Helpers for Status Colors */
  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'PLACED':
        return 'bg-success text-white';
      case 'PENDING':
        return 'bg-warning text-dark';
      case 'SHIPPED':
        return 'bg-info text-white';
      case 'DELIVERED':
        return 'bg-primary text-white';
      case 'CANCELLED':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'PAID':
        return 'bg-success text-white';
      case 'PENDING':
        return 'bg-warning text-dark';
      case 'FAILED':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  getStatusClass(order: Order): string {
    // Optional: you can color entire card header based on order status
    return 'd-flex justify-content-between align-items-center';
  }
}
