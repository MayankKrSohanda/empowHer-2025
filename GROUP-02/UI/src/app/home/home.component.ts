import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../model/product';
import { ProductService } from '../services/product.service';
import { ProductCategory } from '../model/product-category';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  filterForm!: FormGroup;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: ProductCategory[] = [];
  username: string | null = null;
  dataLoaded = false;

  // Notification
  cartMessage: string | null = null;
  showCartMessage = false;
   loading = true;


  @ViewChild('navbarSearch') navbarSearch!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      search: [''],
      categoryId: [''],
      minPrice: [''],
      maxPrice: [''],
    });

    this.username = this.authService.getCurrentUserName() || 'Guest';
    this.loadProducts();
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    if (this.navbarSearch) {
      this.navbarSearch.nativeElement.addEventListener('input', (event: Event) => {
        const target = event.target as HTMLInputElement;
        this.onSearch(target.value);
      });
    }
  }

loadProducts(): void {
  this.loading = true; // show skeleton
  this.productService.listProducts().subscribe((data) => {
    this.products = data;
    this.filteredProducts = data;
    this.dataLoaded = true;
    this.loading = false; // hide skeleton
  });
}

  loadCategories(): void {
    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  // Search / Filter / Sort
   // Accept a string instead of event
 onSearch(searchTerm: string): void {
  searchTerm = searchTerm.toLowerCase().trim();

  this.filteredProducts = !searchTerm
    ? [...this.products]
    : this.products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm)
      );
}


  onFilter(): void {
    const { categoryId, minPrice, maxPrice } = this.filterForm.value;
    this.productService
      .filterProducts(categoryId, minPrice, maxPrice)
      .subscribe((data) => {
        this.filteredProducts = data;
      });
  }

  onReset(): void {
    this.filterForm.reset({
      search: '',
      categoryId: '',
      minPrice: '',
      maxPrice: '',
    });

    if (this.navbarSearch) {
    this.navbarSearch.nativeElement.value = '';
  }
    this.filteredProducts = [...this.products];
  }

  onSort(event: any): void {
    const value = event.target.value;
    if (value === 'low') this.filteredProducts.sort((a, b) => a.price - b.price);
    else if (value === 'high') this.filteredProducts.sort((a, b) => b.price - a.price);
    else this.filteredProducts = [...this.products];
  }

  // Navigation
  viewDetailsEvent(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  goToCart(): void {
    this.ngZone.run(() => this.router.navigate(['/cart']));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Notification
  showAddedToCartMessage(productName: string) {
    this.cartMessage = `✅ ${productName} added to cart! Visit Cart`;
    this.showCartMessage = true;

    setTimeout(() => {
      this.showCartMessage = false;
      this.cartMessage = null;
    }, 2000); // adjust duration here
  }


  
}
