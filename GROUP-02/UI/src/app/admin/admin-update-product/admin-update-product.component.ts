import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import { ProductCategory } from '../../model/product-category';

@Component({
  selector: 'app-admin-update-product',
  templateUrl: './admin-update-product.component.html',
  styleUrls: ['./admin-update-product.component.css']
})
export class AdminUpdateProductComponent implements OnInit {

  product: Product = new Product();
  categories: ProductCategory[] = [];
  selectedFile?: File;
  imagePreview?: string;
  productId!: number;
  
  // ✅ Added property to show success message in template
  updateSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategoriesAndProduct();
    document.body.style.backgroundColor = '#d4edda';
  }

  loadCategoriesAndProduct() {
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;

        this.productService.getProductById(this.productId).subscribe({
          next: (prod) => {
            this.product = Object.assign(new Product(), prod);
            if (this.product.category) this.product.categoryId = this.product.category.id;

            if (this.product.imageUrl) {
              this.imagePreview = `http://localhost:8080${this.product.imageUrl}`;
            }
          },
          error: () => console.error('Failed to load product details')
        });

      },
      error: () => console.error('Failed to load categories')
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => this.imagePreview = e.target.result;
    reader.readAsDataURL(file);
  }

 onUpdate() {
  if (!this.product) return;

  this.productService.updateProduct(this.productId, this.product, this.selectedFile).subscribe({
    next: () => {
      this.updateSuccess = true;
      setTimeout(() => (this.updateSuccess = false), 5000); // auto hide message
      setTimeout(() => this.router.navigate(['admin/products']), 1500);
    },
    error: (err) => {
      console.error('Update failed', err);
      alert('❌ Failed to update product');
    }
  });
}


  // ✅ Add onCancel method used in template
  onCancel() {
    this.router.navigate(['admin/products']);
  }
}
