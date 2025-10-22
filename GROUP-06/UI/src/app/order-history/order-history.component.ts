import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})

export class OrderHistoryComponent implements OnInit {

  orders: any[] = [];
  userId: number = 1; // replace with actual userId from AuthService

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getUserOrders().subscribe({
      next: (res) => {
        console.log('User orders:', res);
        this.orders = res;
      },
      error: (err) => console.error('Failed to load orders', err)
    });
  }

}
