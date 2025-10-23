import { Component, OnInit, ViewChild } from '@angular/core';
import { ManageOrdersService, Order } from '../../services/manage-orders.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  adminName = 'Admin';
  totalPlaced = 0;
  totalShipped = 0;
  totalDelivered = 0;

  weeks: string[] = [];
  earnings: number[] = [];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Weekly Earnings ($)',
        data: [],
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8'],
        borderWidth: 1,
      },
    ],
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: false, // hide legend box
      },
      title: {
        display: true,
        text: 'Weekly Earnings (Last 4 Weeks)',
        font: { size: 16, weight: 'bold' },
        color: '#444',
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#222',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Earnings ($)' },
        ticks: { color: '#555' },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
      },
      x: {
        title: { display: true, text: 'Week Number' },
        ticks: { color: '#555' },
        grid: { display: false },
      },
    },
    elements: {
      bar: {
        borderRadius: {
          topLeft: 12,
          topRight: 12,
        },
        borderSkipped: 'bottom',
      },
    },
  };

  constructor(private manageOrdersService: ManageOrdersService,
     private router: Router
  ) {}

  ngOnInit() {
    this.loadOrdersTotals();
    this.loadWeeklyEarnings();
  }

  loadOrdersTotals() {
    this.manageOrdersService.getAllOrders().subscribe({
      next: (orders: Order[]) => {
        this.totalPlaced = orders.filter(o => o.status === 'Placed').length;
        this.totalShipped = orders.filter(o => o.status === 'Shipped').length;
        this.totalDelivered = orders.filter(o => o.status === 'Delivered').length;
      },
      error: err => console.error(err),
    });
  }

  loadWeeklyEarnings() {
    this.manageOrdersService.getWeeklyEarnings().subscribe({
      next: data => {
        const sortedWeeks = Object.keys(data).sort((a, b) => Number(a) - Number(b));
        this.weeks = sortedWeeks.map(w => 'Week ' + w);
        this.earnings = sortedWeeks.map(w => data[Number(w)]);

        this.barChartData = {
          labels: this.weeks,
          datasets: [
            {
              label: 'Weekly Earnings ($)',
              data: this.earnings,
              backgroundColor: ['#4e73df', '#36b9cc', '#1cc88a', '#f6c23e', '#e74a3b'],
              borderWidth: 0,
              borderRadius: { topLeft: 12, topRight: 12 },
              hoverBackgroundColor: ['#3951b3', '#2a8da1', '#14996e', '#d4a82f', '#c53a2c'],
            },
          ],
        };
        setTimeout(() => this.chart?.update(), 100);
      },
      error: err => console.error(err),
    });
  }

  logout() {
  
     this.router.navigate(['/']);
    
  }
}
