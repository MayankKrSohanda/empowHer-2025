import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/model/Product';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router,private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // ✅ Load all products from backend
  loadProducts(): void {
    this.productService.listAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  // ✅ Navigate to Add Product page
  goToAddProduct(): void {
    this.router.navigate(['/admin/add-product']);
  }

  // ✅ Navigate to Edit Product page
  goToEditProduct(productId: number): void {
    this.router.navigate(['/admin/edit-product', productId]);
  }

  // ✅ Delete a product with confirmation
  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts(); // reload list
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Failed to delete product.');
        }
      });
    }
  }
   logout(){
this.authService.logout();
  }
}
