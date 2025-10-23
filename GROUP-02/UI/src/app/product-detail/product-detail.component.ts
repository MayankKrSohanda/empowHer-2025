import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../model/product';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;

  // Notification state
  cartMessage: string | null = null;
  showCartMessage = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

 ngOnInit(): void {
  const productId = Number(this.route.snapshot.paramMap.get('id'));
  this.productService.getProductById(productId).subscribe({
    next: (data) => {
      this.product = data;
      if (data.imageUrl) {
        this.product.imageUrl = `${environment.apiBaseUrl}${data.imageUrl}`;
      }

      // Trigger animation for card
      setTimeout(() => {
        const card = document.querySelector('.vertical-card') as HTMLElement;
        if (card) card.classList.add('show-card');
      }, 50);
    },
    error: (err) => console.error('Error fetching product:', err)
  });
}

  onAddToCart(event: Event) {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.cartMessage = '⚠️ Please login first';
      this.showCartMessage = true;
      setTimeout(() => this.showCartMessage = false, 2000);
      return;
    }

    if (this.product.quantity === 0) {
      this.cartMessage = '⚠️ Sorry, this product is out of stock. Visit later.';
      this.showCartMessage = true;
      setTimeout(() => this.showCartMessage = false, 2000);
      return;
    }

    event.stopPropagation();

    this.cartService.addToCart(userId, this.product.id).subscribe({
      next: () => {
        // Update quantity locally
        if (this.product.quantity > 0) {
          this.product.quantity -= 1;
        }
        this.cartMessage = `✅ ${this.product.title} added to cart! Visit Cart`;
        this.showCartMessage = true;
        setTimeout(() => this.showCartMessage = false, 2000);
      },
      error: (err) => console.error('❌ Add to cart failed', err)
    });
  }

  viewCart() {
    this.router.navigate(['/cart']);
  }

  backToHome() {
    this.router.navigate(['/home']);
  }
}
