import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  orderId: string = '';
  amount: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navState = history.state;
    this.orderId = navState.orderId || '';
    this.amount = navState.amount || 0;
  }
  goToOrders(){
    this.router.navigate(['/order-summary']);
  }
}
