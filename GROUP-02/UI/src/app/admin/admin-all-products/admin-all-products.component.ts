import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import { ProductCategory } from '../../model/product-category';
import { Router, NavigationStart } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-all-products',
  templateUrl: './admin-all-products.component.html',
  styleUrls: ['./admin-all-products.component.css']
})
export class AdminAllProductsComponent implements OnInit {

  products: Product[] = [];
  categories: ProductCategory[] = [];

  totalProducts = 0;
  activeProducts = 0;
  lowStock = 0;
  outOfStock = 0;

  successMessage = '';
  productIdToDelete?: number;
  deleteModalInstance: any;

  firstVisit = true; // ✅ Flag to track first visit

  constructor(private productService: ProductService, private router: Router) {
    // Reset firstVisit flag when navigating from update page
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (!event.url.includes('/admin/all-products')) {
          this.firstVisit = false; // leaving page
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    const modalEl = document.getElementById('deleteModal');
    if (modalEl) {
      this.deleteModalInstance = new bootstrap.Modal(modalEl);
    }
  }

  goToDashboard() {
    this.router.navigate(['/admin/home']);
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.loadProducts();
      },
      error: () => alert('❌ Failed to load categories')
    });
  }

  loadProducts() {
    this.productService.listProducts().subscribe({
      next: (prods) => {
        this.products = prods.map(prod => {
          const productInstance = Object.assign(new Product(), prod);
          const categoryObj = productInstance.category;
          (productInstance as any).categoryName = categoryObj ? categoryObj.name : 'N/A';
          return productInstance;
        });

        this.totalProducts = this.products.length;
        this.activeProducts = this.products.filter(p => p.quantity > 0).length;
        this.lowStock = this.products.filter(p => p.quantity > 0 && p.quantity <= 10).length;
        this.outOfStock = this.products.filter(p => p.quantity === 0).length;
      },
      error: () => alert('❌ Failed to load products')
    });
  }

  editProduct(product: Product) {
    this.router.navigate(['/admin/update-product', product.id]);
  }

  openDeleteModal(id: number) {
    this.productIdToDelete = id;
    this.deleteModalInstance.show();
  }

  confirmDelete() {
    if (!this.productIdToDelete) return;

    this.productService.deleteProduct(this.productIdToDelete).subscribe({
      next: () => {
        this.successMessage = '🗑️ Product deleted successfully!';
        this.loadProducts();
        this.deleteModalInstance.hide();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: () => {
        alert('❌ Failed to delete product');
        this.deleteModalInstance.hide();
      }
    });
  }
}
