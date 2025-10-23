// ... keep your existing imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import { ProductCategory } from '../../model/product-category';

@Component({
  selector: 'app-admin-add-product',
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.css']
})
export class AdminAddProductComponent implements OnInit {

  productForm!: FormGroup;
  categories: ProductCategory[] = [];
  productId?: number;
  selectedFile?: File;
  imagePreview?: string;

  successMessage: string = '';
  errorMessage: string = '';
  private toastTimeout: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      quantity: [0, Validators.required],
      categoryId: [null, Validators.required]
    });

    this.loadCategories();
    if (this.productId) this.loadProduct(this.productId);
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: () => this.showError('❌ Failed to load categories')
    });
  }

  loadProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.productForm.patchValue({
          title: prod.title,
          description: prod.description,
          price: prod.price,
          quantity: prod.quantity,
          categoryId: prod.categoryId
        });
        this.imagePreview = prod.imageUrl;
      },
      error: () => this.showError('❌ Failed to load product')
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  saveProduct() {
    if (this.productForm.invalid) return;

    const product: Product = { ...this.productForm.value };

    if (this.productId) {
      // Update existing product
      this.productService.updateProduct(this.productId, product, this.selectedFile).subscribe({
        next: () => {
          this.showSuccess('✏️ Product updated successfully!');
          setTimeout(() => this.router.navigate(['/admin/products']), 2000);
        },
        error: () => this.showError('❌ Failed to update product')
      });
    } else {
      // Add new product
      this.productService.addProduct(product, this.selectedFile).subscribe({
        next: () => {
          this.showSuccess('➕ Product added successfully!');
          setTimeout(() => this.router.navigate(['/admin/products']), 2000);
        },
        error: () => this.showError('❌ Failed to add product')
      });
    }
  }

  // Toast helpers
  private showSuccess(message: string) {
    this.successMessage = message;
    this.clearToastTimeout();
    this.toastTimeout = setTimeout(() => (this.successMessage = ''), 4000);
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.clearToastTimeout();
    this.toastTimeout = setTimeout(() => (this.errorMessage = ''), 4000);
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private clearToastTimeout() {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }
}
