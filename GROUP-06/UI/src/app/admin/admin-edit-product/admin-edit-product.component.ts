import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/model/Product';
import { CartService } from 'src/app/services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-edit-product',
  templateUrl: './admin-edit-product.component.html',
  styleUrls: ['./admin-edit-product.component.scss']
})
export class AdminEditProductComponent implements OnInit {
   productId!: number;
  product: any = {};
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }
 categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Books' },
    { id: 4, name: 'Home Appliances' }
  ];
  loadProduct(): void {
    this.http
      .get(`http://localhost:8080/api/products/${this.productId}`)
      .subscribe({
        next: (data: any) => {
          this.product = data;
        },
        error: (err) => {
          console.error('❌ Failed to fetch product:', err);
          alert('Error loading product details.');
        }
      });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.product.title);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price.toString());
    formData.append('category', this.product.category.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http
      .put(
        `http://localhost:8080/api/admin/update-product/${this.productId}`,
        formData
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Product updated successfully:', response);
          alert('Product updated successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('❌ Error updating product:', error);
          alert('Failed to update product. Check backend logs.');
        }
      });
  }
}
