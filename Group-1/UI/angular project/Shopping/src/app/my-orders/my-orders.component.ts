import { Component, OnInit } from '@angular/core'; 
import { OrderDetail, OrderItem } from '../model/order-detail'; 
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit { 
  orders: OrderDetail[] = []; 

  constructor(private orderService: OrderService) {} 

  ngOnInit(): void {
    localStorage.setItem('userId', '1'); 
    const userId = Number(localStorage.getItem('userId'));
    this.orderService.getOrdersByUser(userId).subscribe({
      next: (data: OrderDetail[]) => this.orders = data,
      error: (err: any) => console.error(err)
    });
  }

  getProductImage(item: OrderItem): string {
    if (item.productImage) {
      return item.productImage;
    }
    // Fallback to a default image if no image is provided
    return 'assets/Screenshot 2025-09-14 000242.png';
  }
}
