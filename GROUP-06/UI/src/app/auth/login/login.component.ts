import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
 
  user = { email: '', password: '' };

  constructor(private auth: AuthService, private router: Router) {}

  // onLogin() {
  //   this.auth.login(this.user).subscribe({
  //     next: (res) => {
  //       console.log('Login Response:', res); // Debug response
  //       console.log(res.message);
  //       if (res.message) {
  //        this.showBootstrapAlert(res.message);
  //       }

  //       // Assuming backend returns { role: 'admin' } or { role: 'customer' }
  //       if (res.role === 'admin') {
  //         console.log("dashboard");
  //         this.router.navigate(['/admin']);
  //         localStorage.setItem('isLoggedIn', 'true');  
  //       } else if (res.role === 'customer') {
  //         this.router.navigate(['/customer/home']);
  //       } else {
  //         this.router.navigate(['/auth/login']);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Login error:', err);
  //       alert('Invalid credentials');
  //     }
  //   });
  // }
  
  onLogin() {
  this.auth.login(this.user).subscribe({
    next: (res) => {
      console.log('Login Response:', res);

      // Always show the message from backend
      if (res.message) {
        this.showBootstrapAlert(res.message, 'success');
      }

      // Handle role with small delay (so alert is visible)
      if (res.role === 'admin') {
        setTimeout(() => {
          this.router.navigate(['/admin']);
          localStorage.setItem('isLoggedIn', 'true');
        }, 1000); // wait 1.5 seconds before redirecting
      } 
      else if (res.role === 'customer') {
        setTimeout(() => {
          this.router.navigate(['/customer/home']);
        }, 1000);
      } 
      else {
        this.showBootstrapAlert('Unknown role. Please contact support.', 'warning');
      }
    },
    error: (err) => {
      console.error('Login error:', err);
      this.showBootstrapAlert('Invalid credentials. Please try again.', 'danger');
    }
  });
}

 showBootstrapAlert(message: string, type: string = 'info'): void {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
      console.error('⚠️ Alert container not found in DOM');
      return;
    }

    // Clear old alert
    alertContainer.innerHTML = '';

    // Create Bootstrap alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show text-center mt-3`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.textContent = message;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close';
    closeBtn.setAttribute('data-bs-dismiss', 'alert');
    closeBtn.setAttribute('aria-label', 'Close');
    alertDiv.appendChild(closeBtn);

    alertContainer.appendChild(alertDiv);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      alertDiv.classList.remove('show');
      alertDiv.classList.add('hide');
      alertDiv.remove();
    }, 3000);
  }

  





}
