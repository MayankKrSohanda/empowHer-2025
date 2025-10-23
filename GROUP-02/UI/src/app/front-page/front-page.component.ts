import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit, OnDestroy {

  features = [
    { icon: 'bi bi-speedometer2', title: 'Fast & Efficient', desc: 'Quick product management and smooth shopping experience.' },
    { icon: 'bi bi-box-seam', title: 'Curated Collection', desc: 'Discover handpicked and unique collections.' },
    { icon: 'bi bi-lock', title: 'Secure Login', desc: 'Separate admin and user logins with secure authentication.' },
    { icon: 'bi bi-collection', title: 'Organized Inventory', desc: 'Keep your products in check easily.' },
    { icon: 'bi bi-wallet2', title: 'Weekly Earnings', desc: 'Track your weekly performance and earnings.' },
  ];

  currentIndex = 0;
  slideInterval: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  startCarousel() {
    this.slideInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.features.length;
    }, 3000); // change feature every 3 seconds
  }

  adminLogin() { this.router.navigate(['/admin/login']); }
  userLogin() { this.router.navigate(['/login']); }
  userSignup() { this.router.navigate(['/signup']); }
}
