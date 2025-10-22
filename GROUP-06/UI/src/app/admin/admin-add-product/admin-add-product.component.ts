import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/model/Product';

@Component({
  selector: 'app-admin-add-product',
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.scss']
})
export class AdminAddProductComponent {
  product: Product = {
    title: '',
    description: '',
    quantity: 0,
    price: 0,
    categoryId: 0,
    imageUrl: '',
    productId: 0,
    category: ''
  };

  selectedFile: File | null = null;

  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Books' },
    { id: 4, name: 'Home Appliances' }
  ];

  constructor(private productService: ProductService, private router: Router) {}

  // capture image file
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
const formData = new FormData();
// Debug: log the fields being appended
console.log('title:', this.product.title);
console.log('description:', this.product.description || '');
console.log('quantity:', this.product.quantity.toString());
console.log('price:', this.product.price.toString());
console.log('category_id:', this.product.categoryId.toString());
if (this.selectedFile) {
  console.log('image:', this.selectedFile.name);
}

    formData.append('title', this.product.title);
    formData.append('description', this.product.description || '');
    formData.append('quantity', this.product.quantity.toString());
    formData.append('price', this.product.price.toString());

    // ✅ FIXED: send categoryId instead of name
    formData.append('categoryId', this.product.categoryId.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.addProduct(formData).subscribe({
      next: (response) => {
        console.log('✅ Product added successfully:', response);
        alert('Product added successfully!');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('❌ Error adding product:', err);
        alert('Failed to add product. Please check console for details.');
      }
    });
  }
}
