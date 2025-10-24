import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../model/product';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { CartItem } from '../model/cart-item';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() product!: Product;
  @Output() viewDetails = new EventEmitter<number>();
  @Output() notify = new EventEmitter<{
    type: 'success' | 'error';
    message: string;
  }>();

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}
  cartItems: CartItem[] = [];

  ngOnInit() {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) return;

    // subscribe to cart updates
    this.cartService.cartItems$.subscribe((items) => (this.cartItems = items));

    // load initial cart items
    this.cartService.loadCart(userId);
  }

  onViewDetails(event: Event, productId: number) {
    this.viewDetails.emit(productId);
  }

  isAddToCartDisabled(): boolean {
    if (!this.product.isActive || this.product.quantity <= 0) return true;

    const itemInCart = this.cartItems.find(
      (i) => i.productId === this.product.id
    );
    if (itemInCart && itemInCart.prodAvailQuantity - itemInCart.quantity <= 0)
      return true;

    return false;
  }

  onAddToCart(product: Product, event: Event) {
    if (!product.isActive || product.quantity <= 0) return;

    const userId = this.authService.getLoggedInUserId();
    if (!userId) {
      this.notify.emit({
        type: 'error',
        message: 'Please log in to add itms to the cart.',
      });
      return;
    }
    this.cartService.addToCart(userId, product.id!).subscribe({
      next: () =>
        this.notify.emit({
          type: 'success',
          message: product.title + 'added to cart!',
        }),
      error: () =>
        this.notify.emit({
          type: 'error',
          message: 'Failed to add to cart,Please try again',
        }),
    });
  }
}
