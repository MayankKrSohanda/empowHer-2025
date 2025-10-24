import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

declare var Chart: any;

@Component({
  selector: 'app-admin-over-view',
  templateUrl: './admin-over-view.component.html',
  styleUrls: ['./admin-over-view.component.css'],
})
export class AdminOverViewComponent implements OnInit {
  summaryCards = [
    {
      label: 'Total Products',
      value: 0,
      icon: 'bi-box-seam',
      bg: 'bg-primary',
    },
    {
      label: 'Out of Stock',
      value: 0,
      icon: 'bi-exclamation-circle',
      bg: 'bg-danger',
    },
    {
      label: 'Total Orders',
      value: 0,
      icon: 'bi-cart-check',
      bg: 'bg-success',
    },
    {
      label: 'Delivered Orders',
      value: 0,
      icon: 'bi-hourglass-split',
      bg: 'bg-warning',
    },
    { label: 'Total Revenue', value: '₹0', icon: 'bi-currency-rupee', bg: 'bg-info' },
  ];

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOverviewData();
  }

  loadOverviewData() {
    forkJoin({
      products: this.productService.getProducts(),
      orders: this.orderService.getAllOrders(),
    }).subscribe({
      next: ({ products, orders }) => {
        const totalProducts = products.length;
        const outOfStockCount = products.filter((p) => p.quantity === 0).length;
        const totalOrders = orders.length;
        const deliveredOrders = orders.filter(
          (o) => o.orderStatus === 'DELIVERED'
        ).length;
        const revenue = orders
          .filter((o) => o.paymentStatus === 'PAID')
          .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        this.summaryCards = [
          {
            label: 'Total Products',
            value: totalProducts,
            icon: 'bi-box-seam',
            bg: 'bg-primary',
          },
          {
            label: 'Out of Stock',
            value: outOfStockCount,
            icon: 'bi-exclamation-circle',
            bg: 'bg-danger',
          },
          {
            label: 'Total Orders',
            value: totalOrders,
            icon: 'bi-cart-check',
            bg: 'bg-success',
          },
          {
            label: 'Delivered Orders',
            value: deliveredOrders,
            icon: 'bi-hourglass-split',
            bg: 'bg-warning',
          },
          {
            label: 'Total Revenue',
            value: `₹${revenue.toLocaleString()}`,
            icon: 'bi-currency-rupee',
            bg: 'bg-info',
          },
        ];

        // ✅ CALL THIS TO GENERATE THE CHART
        this.generateRevenueChart(orders);
      },
      error: (err) => console.error('Failed to load overview data', err),
    });
  }
  generateRevenueChart(orders: any[]) {
    const revenueByMonth: { [key: string]: number } = {};

    orders
      .filter((o) => o.paymentStatus === 'PAID')
      .forEach((order) => {
        const date = new Date(order.orderDate);
        const month = date.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        revenueByMonth[month] =
          (revenueByMonth[month] || 0) + (order.totalPrice || 0);
      });

    const labels = Object.keys(revenueByMonth);
    const data = labels.map((month) => revenueByMonth[month]);

    const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const ctx = canvas.getContext('2d');

    new Chart(ctx!, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Revenue (₹)',
            data: data,
            backgroundColor: 'rgba(13, 110, 253, 0.7)',
            borderColor: 'rgba(13, 110, 253, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y', // 👈 Horizontal Bar
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return `₹${context.raw.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: '#666',
              callback: function (value: number) {
                return '₹' + value.toLocaleString();
              },
            },
            grid: {
              color: '#eee',
            },
          },
          y: {
            ticks: {
              color: '#333',
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }
}
