import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  userId: number = 0;
  expandedOrderIds: Set<number> = new Set(); // Track expanded orders

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUserId();
    if (currentUser) {
      this.userId = currentUser;
      this.loadOrders();
    }
  }

  loadOrders() {
    this.orderService.getOrders(this.userId).subscribe(data => {
      this.orders = data;
    });
  }

  toggleDetails(orderId: number) {
    if (this.expandedOrderIds.has(orderId)) {
      this.expandedOrderIds.delete(orderId);
    } else {
      this.expandedOrderIds.add(orderId);
    }
  }

  isExpanded(orderId: number) {
    return this.expandedOrderIds.has(orderId);
  }

  getTotal(order: any) {
    return order.items.reduce(
      (sum: number, i: any) => sum + i.price * i.quantity,
      0
    );
  }
}
