import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { Product } from '../model/product';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() product!: Product;
  @Output() viewDetails = new EventEmitter<number>();
  @Output() addedToCart = new EventEmitter<string>(); // 🔹 emit product name

  constructor(
    private authService: AuthService,
    private cartService: CartService,
     private productService: ProductService,
       private ngZone: NgZone
  ) {}

  





  viewDetailsEvent(productId: number) {
    this.viewDetails.emit(productId);
  }

  onAddToCart(event: Event) {
    event.stopPropagation(); // Prevent card click

    if (this.product.quantity === 0) {
      // Optionally you can show a notification bar instead of alert here too
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      // Optionally show a notification bar for login required
      return;
    }

    this.cartService.addToCart(userId, this.product.id).subscribe({
      next: () => {
        this.addedToCart.emit(this.product.title); // 🔹 emit product name
      },
      error: err => console.error('❌ Add to cart failed', err),
    });
  }
}
