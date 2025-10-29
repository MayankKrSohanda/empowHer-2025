import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html'
})
export class EditProductComponent implements OnInit, OnDestroy {
  product: any = {
    id: 0,
    title: '',
    description: '',
    availableQuantity: 0,
    price: 0,
    categoryId: 0,
    category: { id: 0 }
  };

  categories: Array<{id: number, name: string}> = [];
  selectedCategoryId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private navbarService: NavbarService
  ) {}

ngOnInit(): void {
    this.navbarService.hide();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe(data => {
        this.product = data as any;
        console.log('Loaded product:', data);
        // Handle both response types from backend
        if (data.categoryId) {
          this.selectedCategoryId = data.categoryId;
        } else if ((data as any).category && (data as any).category.id) {
          this.selectedCategoryId = (data as any).category.id;
        }
    });

    this.categories=[
      {id: 1, name: 'Fashion'},
      {id: 2, name: 'Electronics'},
      {id: 3, name: 'Jwelleries'},
      {id: 4, name: 'Sports'}
    ]
}

ngOnDestroy(): void {
  this.navbarService.show();
}

onSubmit(): void {
  // Transform the product to match backend expectations
  const productToUpdate = {
    id: this.product.id,
    title: this.product.title,
    description: this.product.description,
    price: this.product.price,
    availableQuantity: this.product.availableQuantity,
    isActive: this.product.isActive !== undefined ? this.product.isActive : true,
    category: { id: this.selectedCategoryId || this.product.categoryId }
  };

  this.productService.updateProduct(this.product.id!, productToUpdate).subscribe({
    next: () => {
      alert('Product updated successfully!');
      this.router.navigate(['/admin']); // go back to admin dashboard
    },
    error: (err) => {
      console.error('Error updating product:', err);
      alert('Error updating product. Please try again.');
    }
  });
}


}
