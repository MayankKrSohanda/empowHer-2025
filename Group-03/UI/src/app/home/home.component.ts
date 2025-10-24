import { Component, OnInit } from '@angular/core';
import { ProductService, SearchCriteria } from '../services/product.service';
import { Product } from '../model/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  alertMsg: string = '';
  alertType: 'success' | 'danger' = 'success';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts(): void {
    this.productService.getProducts({}).subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
    });
  }

  onSearch(criteria: SearchCriteria): void {
    const nothingProvided =
      !criteria.title &&
      criteria.categoryId == null &&
      criteria.minPrice == null &&
      criteria.maxPrice == null;

    if (nothingProvided) {
      this.loadAllProducts();
      return;
    }

    this.productService.getProducts(criteria).subscribe((data) => {
      this.filteredProducts = data;
    });
  }

  onViewDetails($event: Number) {
    this.router.navigate(['products/' + $event]);
  }
  onCardNotify(event: { type: 'success' | 'error'; message: string }) {
    this.alertMsg = event.message;
    this.alertType = event.type === 'success' ? 'success' : 'danger';
    setTimeout(() => (this.alertMsg = ''), 3000);
  }
}
