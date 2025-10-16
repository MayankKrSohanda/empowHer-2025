import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../model/product';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AddToCartRequest } from '../model/addToCartRequest';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  
  product: Product | null = null;
  productId!: number;
  selectedQuantity: number = 1;
  private userId: number = 1; 
  alertMessage:string|null=null;
  alertType:'success'|'danger'='success';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      if (this.productId) {
        this.loadProductDetails(this.productId);
      }
    });
  }

  private loadProductDetails(productId: number) {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        console.log("Product details loaded:", product);
        this.product = product;
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      }
    });
  }

  addToCart() {
    if (!this.product?.id) {
      console.error('Product or Product ID is not defined.');
      return;
    }

    const userId = Number(localStorage.getItem('userId')) || this.userId;

    const request: AddToCartRequest = {
      productId: this.product.id,
      quantity: this.selectedQuantity,
      userId: userId
    };

    this.cartService.addToCart(request).subscribe({
      next: (response) => {
        this.alertType='success';
        this.alertMessage="Product added to cart";
        setTimeout(()=>this.alertMessage=null,3000);
        console.log('Product added to cart:', response);
      },
      error: (err) => {
        this.alertType='danger';
        this.alertMessage="Error adding to cart";
        setTimeout(()=>this.alertMessage=null,3000);
        if (err.status === 200) {
          alert("Item added to cart (with warning)");
          console.log('Product added despite error callback!');
        }
      }
    });
  }

  goToCart() {
    this.router.navigateByUrl("/cart");
  }
}
