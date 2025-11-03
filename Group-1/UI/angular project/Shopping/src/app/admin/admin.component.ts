import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from '../services/navbar.service';
import { OrderDetail, OrderItem } from '../model/order-detail';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  displayProduct:boolean=false;
  addProduct:boolean=false;
  dashboard:boolean=true;

  totalRevenue: number = 0;
  totalOrders: number = 0;
  totalProducts: number = 0;
  activeProducts: number = 0;
  inStock: number = 0;
  outOfStock: number = 0;

  constructor(private router:Router, private navbarService: NavbarService,private orderService: OrderService, private productService: ProductService){}
  
  ngOnInit(): void {
    this.navbarService.hide();
    localStorage.setItem('userId', '1'); 
    const userId = Number(localStorage.getItem('userId'));
    this.orderService.getOrdersByUser(userId).subscribe({
      next: (data: OrderDetail[]) => this.orders = data,
      error: (err: any) => console.error(err)
    });

    // Get all orders for statistics
    this.orderService.getAllOrders().subscribe({
      next: (data: OrderDetail[]) => {
        this.calculateStats(data);
      },
      error: (err: any) => console.error(err)
    });

    // Get product count
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.activeProducts = products.filter(p => (p as any).isActive !== false).length;
        this.inStock = products.filter(p => p.availableQuantity > 0).length;
        this.outOfStock = products.filter(p => p.availableQuantity === 0).length;
      },
      error: (err: any) => console.error(err)
    });
  }
  ngOnDestroy(): void {
    this.navbarService.show();
  }
  displayProducts(){
    this.addProduct=false;
    this.dashboard=false;
    this.displayProduct=true;
  }

  showDashboard(){
    this.dashboard=true;
    this.displayProduct=false;
    this.addProduct=false;
  }
  addProducts(){
    this.dashboard=false;
    this.displayProduct=false;
    this.addProduct=true;
  }
  logout(){
    this.router.navigateByUrl("/login");
  }
  orders: OrderDetail[] = []; 

  calculateStats(allOrders: OrderDetail[]): void {
    // Calculate total revenue from all orders
    this.totalRevenue = 0;
    this.totalOrders = 0;

    allOrders.forEach(order => {
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          this.totalRevenue += item.totalPrice;
          this.totalOrders += 1; // Count each product item as an order
        });
      }
    });

    // Format total revenue to 2 decimal places
    this.totalRevenue = Math.round(this.totalRevenue * 100) / 100;
  }

  getFormattedNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  getProductImage(item: OrderItem): string {
    if (item.productImage) {
      return item.productImage;
    }
    
    return 'assets/Screenshot 2025-09-14 000242.png';
  }
}

