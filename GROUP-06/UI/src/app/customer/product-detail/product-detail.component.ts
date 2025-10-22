import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/model/Product'; // Adjust path
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  product?: Product;      // Product object (optional for loader)
  quantity: number = 1;   // Default quantity
  isLoading: boolean = true; // Show loader while fetching

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService:CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id']; // /product/:id
    this.productService.getProductById(productId).subscribe(
      data => {
        this.product = data;
        this.isLoading = false;
      },
      err => {
        console.error(err);
        this.isLoading = false;
      }
    );
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(` ${product.title} added to cart!`);
  }

  goBack() {
    this.router.navigate(['/customer/home']); // Or product listing page
  }
}
