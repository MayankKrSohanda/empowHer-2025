import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import { Category } from 'src/app/model/category';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html'
})
export class EditProductComponent implements OnInit, OnDestroy {
  product: Product = {
    id: 0,
    title: '',
    description: '',
    availableQuantity: 0,
    price: 0,
    categoryId: 0
  };

  categories:Category[]=[];
  productId!: number;

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
        this.product = data;
    });

    this.categories=[
      {categoryId:1, categoryName:'Fashion'},
      {categoryId:2, categoryName:'Electronics'},
      {categoryId:3, categoryName:'Jwelleries'},
      {categoryId:4, categoryName:'Sports'}
      
    ]
}

ngOnDestroy(): void {
  this.navbarService.show();
}

onSubmit(): void {
  this.productService.updateProduct(this.product.id!, this.product).subscribe({
    next: () => {
      alert('Product updated successfully!');
      this.router.navigate(['/admin/products']); // go back to list
    },
    error: (err) => {
      console.error('Error updating product:', err);
    }
  });
}


}
