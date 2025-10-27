import { Component, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Router, NavigationEnd } from '@angular/router';
import { Product } from '../model/product';
import { NavbarService } from '../services/navbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy{

   searchTitle:string="";
   allProducts: Product[] = [];
   
    isCartPage = false;
    isHomePage=false;
    isProductFormPage = false;
    isAdminPage=false;
    showNavbar:boolean=true;
    subscription:Subscription;
    isChatPage = false;
    isOrderspage=false;

     filteredProducts:Product[]=[];
  constructor(private productService: ProductService, private router:Router, private cartService: CartService, private navbarService:NavbarService){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCartPage = event.url.includes('/cart');
        this.isHomePage = event.url.includes('/home');
        this.isChatPage = event.url.includes('/chat-bot');
        this.isOrderspage = event.url.includes('/my-orders');
      }
    });

    this.subscription= this.navbarService.showNavbar.subscribe((value)=>{
      this.showNavbar=value;
    });

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchProducts(){
    this.productService.setSearch(this.searchTitle);
    
  }
  resetSearch(){
    this.searchTitle='';
    this.productService.setSearch('');
  }

  goToChat(){
    this.router.navigateByUrl("/chat-bot");
  }
}