import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order, OrderProduct } from 'src/app/model/order';
import { ProductService } from 'src/app/services/product.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/model/product';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  @ViewChild('toastEl',{static:true}) toastEl!: ElementRef;

  orders: Order[] = [];
  loading = false;

  showingToast = false;
  toastMessage = '';
  toastInstance:any;

  constructor(private orderService: OrderService,
    private productService:ProductService
  ) { }

  ngOnInit(): void {
    this.fetchAllOrders();
    this.toastInstance = new bootstrap.Toast(this.toastEl.nativeElement, {
      delay: 3000 
    });
  }

  fetchAllOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.orders.forEach(o => o.showDetails = false);
        this.loading = false;

        // After fetching orders, fetch product titles
        this.orders.forEach(order => this.loadProductTitles(order));
      },
      error: (err: any) => {
        console.error('Failed to load orders', err);
        this.loading = false;
      }
    });
  }
  private loadProductTitles(order: Order) {
  const observables = order.items.map((item: OrderProduct) =>
    this.productService.getProductById(item.productId).pipe(
      map((product: Product) => {
        item.productTitle = product.title;
      })
    )
    );
    forkJoin(observables).subscribe({
      next: () => {},
      error: (err) => console.error('Failed to fetch product titles', err)
    });
  }

  // refreshOrders(): void {
  //   this.fetchAllOrders();
  // }

  viewOrderDetails(order: Order): void {
    order.showDetails = !order.showDetails;
  }

  updatePaymentStatus(order: Order, status: string): void {
    order.paymentStatus = status;
    this.showToast(`Payment status updated to ${status}`);
    this.orderService.updatePaymentStatus(order.id, status).subscribe({
      next: () => {},
      error: (err: any) => console.error('Failed to update payment status', err)
    });
  }

  updateOrderStatus(order: Order, status: string): void {
    order.orderStatus = status;
    this.showToast(`Order status updated to ${status}`);
    this.orderService.updateOrderStatus(order.id, status).subscribe({
      next: () => {},
      error: (err: any) => console.error('Failed to update order status', err)
    });
  }

 showToast(message: string) {
    this.toastMessage = message;

    // Initialize bootstrap toast once
  this.toastInstance.show();
  }
}
