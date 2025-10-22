import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  constructor(private router: Router, private authService: AuthService) {}

  shopNow() {
    // Redirect to customer dashboard
    this.router.navigate(['/customer/home']);
  }

  Login() {
    
      // Redirect to login page
      this.router.navigate(['/login']);
  }
}
