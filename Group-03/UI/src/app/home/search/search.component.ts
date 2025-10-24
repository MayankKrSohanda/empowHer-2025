import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService, SearchCriteria, Category } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<SearchCriteria>();

  title: string | null = null;
  categoryId: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  categories: Category[] = [];
  private categorySub!: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Subscribe to the BehaviorSubject of categories
    this.categorySub = this.productService.categories$.subscribe(
      (cats) => (this.categories = cats)
    );

    // Trigger API call to fetch categories (will update BehaviorSubject)
    this.productService.loadCategories();
  }

  ngOnDestroy(): void {
    this.categorySub?.unsubscribe();
  }

  onSearch(): void {
    this.searchEvent.emit({ title: this.title });
  }

  onFilter(): void {
    this.searchEvent.emit({
      categoryId: this.categoryId,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });
  }

  onReset(): void {
    this.title = null;
    this.categoryId = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.searchEvent.emit({});
  }
}
