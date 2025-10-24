import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router, private authService: AuthService) {}

  isLoggedIn():boolean{
    return this.authService.isLoggedIn() && this.authService.getRole()?.toLowerCase() !== 'admin';
  }
  get userName(): string | null{
    return this.authService.getUserName();
  }
  logout():void {
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }

}
