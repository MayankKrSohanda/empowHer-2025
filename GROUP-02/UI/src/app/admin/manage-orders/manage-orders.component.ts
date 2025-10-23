import { Component, OnInit } from '@angular/core';
import { ManageOrdersService, Order } from '../../services/manage-orders.service';
import { Router } from '@angular/router';

type OrderStatus = 'Placed' | 'Shipped' | 'Delivered';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  successMessage = '';

  constructor(private manageOrdersService: ManageOrdersService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  goToDashboard() {
    this.router.navigate(['/admin/home']);
  }

 loadOrders() {
  this.loading = true;
  this.manageOrdersService.getAllOrders().subscribe({
    next: (data) => {
      console.log('Orders from API:', data); // check all orders here
      this.orders = [...data]; // spread to trigger change detection
      this.sortOrders();
      this.loading = false;
    },
    error: () => {
      this.loading = false;
      alert('❌ Failed to fetch orders');
    }
  });
}


  private sortOrders() {
    const statusOrder: Record<OrderStatus, number> = {
      Placed: 1,
      Shipped: 2,
      Delivered: 3
    };
    this.orders.sort((a, b) => statusOrder[a.status as OrderStatus] - statusOrder[b.status as OrderStatus]);
  }

  shipOrder(order: Order) {
    this.manageOrdersService.shipOrder(order.orderId).subscribe({
      next: () => {
        order.status = 'Shipped';
        this.sortOrders();
        this.showSuccess('🚚 Order shipped successfully!');
      },
      error: () => alert('❌ Failed to ship order')
    });
  }

  deliverOrder(order: Order) {
    this.manageOrdersService.deliverOrder(order.orderId).subscribe({
      next: () => {
        order.status = 'Delivered';
        this.sortOrders();
        this.showSuccess('📦 Order delivered successfully!');
      },
      error: () => alert('❌ Failed to deliver order')
    });
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 3000);
  }
}
