import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService, Category } from '../../services/product.service';
import { Product } from '../../model/product';
import { Subscription } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  error = '';
  previewImages: { url: string }[] = [];
  toastMsg = '';
  toastType: 'success' | 'danger' | 'info' = 'success';
  selectedDeleteId: number | null = null;
  filterStock: 'all' | 'inStock' | 'outStock' = 'all';

  private subs: Subscription[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Subscribe to BehaviorSubjects for instant/reactive updates
    this.subs.push(
      this.productService.categories$.subscribe(
        (cats) => (this.categories = cats)
      )
    );
    this.subs.push(
      this.productService.products$.subscribe((prods) => {
        this.products = prods;
        console.log(typeof this.products[0].isActive);
        this.loading = false;
      })
    );

    // Trigger fresh data fetch from backend (so data persists across refresh)
    this.productService.loadCategories();
    this.productService.loadProducts();
  }

  openImgPreview(images: { url: string }[]) {
    this.previewImages = images;
    const modalEl = document.getElementById('imagePreviewModal');
    const modal = new bootstrap.Modal(modalEl!);
    modal.show();
  }
  getCategoryName(id: number | string): string {
    const cat = this.categories.find(
      (c) => Number(c.categoryId) === Number(id)
    );
    return cat ? cat.categoryName : 'Unknown';
  }
  setFilterStock(filter: 'all' | 'inStock' | 'outStock'): void {
    this.filterStock = filter;
  }

  get filteredProducts(): Product[] {
    switch (this.filterStock) {
      case 'inStock':
        return this.products.filter(p => p.quantity > 0);
      case 'outStock':
        return this.products.filter(p => p.quantity === 0);
      default:
        return this.products;
    }
  }

 deleteProduct(id: number) {
  this.selectedDeleteId = id;
  const modalEl = document.getElementById('deleteConfirmModal');
  const modal = new bootstrap.Modal(modalEl!);
  modal.show();
}
  confirmDelete() {
  if (!this.selectedDeleteId) return;

  this.productService.deleteProduct(this.selectedDeleteId).subscribe({
    next: () => {
      this.toastMsg = 'Product deleted successfully!';
      this.toastType = 'success';
      this.showToast();
    },
    error: () => {
      this.toastMsg = 'Failed to delete product!';
      this.toastType = 'danger';
      this.showToast();
    },
  });

  // Hide the modal after deletion
  const modalEl = document.getElementById('deleteConfirmModal');
  const modal = bootstrap.Modal.getInstance(modalEl!);
  modal?.hide();
}

  showToast(){
    const toastEl=document.getElementById('liveToast');
    if(toastEl){
      const toast=new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
