// import { Component } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   //inside @component we are passing object as param
//   selector: 'app-root', // value of selector used as html tag
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent {
//   title = 'Angular-demo';
//   constructor(private router: Router) {}
//   showNavbar() {
//     return this.router.url !== '/login';
//   }
// }
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currentUrl: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  isLoginPage(): boolean {
    return this.currentUrl === '/login' || this.currentUrl === '/sign-up';
  }
}
