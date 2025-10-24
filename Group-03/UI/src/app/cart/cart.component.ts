import { Component, NgZone, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { CartItem } from '../model/cart-item';
import { Router } from '@angular/router';
import { Product } from '../model/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  products: Product[] = [];
  toastMessage: string = '';
  private toastTimer: any;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) return;

    this.cartService.cartItems$.subscribe((items) => (this.cartItems = items));
    this.cartService.loadCart(userId);
    this.productService.products$.subscribe(
      (products) => (this.products = products)
    );
    this.productService.loadProducts();
  }

  clearCart() {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) return;

    this.cartService.clearCart(userId).subscribe({
      next: () => (this.cartItems = []),
      error: () => this.showToast('Failed to clear cart'),
    });
  }
  getProductImage(item: CartItem): string {
    const product = this.products.find((p) => p.id === item.productId);
    return product?.productImg?.[0]?.url || 'assets/default-product.png';
  }

  removeItem(itemId: number) {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) return;

    this.cartService.removeItem(userId, itemId).subscribe({
      next: () =>
        (this.cartItems = this.cartItems.filter((i) => i.id !== itemId)),
      error: () => this.showToast('Failed to remove item'),
    });
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.productPrice * (item.quantity || 1),
      0
    );
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/home']); // or '/home' depending on your route
  }

  increaseQuantity(item: CartItem) {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) return;

    const newQuantity = (item.quantity || 1) + 1;
    if (item.quantity && newQuantity > item.prodAvailQuantity) {
      this.showToast('Cannot exceed available stock.');
      return;
    }

    this.cartService
      .updateCartItemQuantity(userId, item.id, newQuantity)
      .subscribe({
        next: (updatedItem) => {
          if (updatedItem) item.quantity = updatedItem.quantity;
          else this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
        },
        error: (err) => this.showToast(err.error || 'Cannot increase quantity'),
      });
  }

  showToast(message: string) {
    this.ngZone.run(() => {
      this.toastMessage = message;
    

      // clear any running timer
      if (this.toastTimer) clearTimeout(this.toastTimer);

      // hide toast after 3 seconds
      this.toastTimer = setTimeout(() => {
        this.ngZone.run(() => (this.toastMessage = ''));
        this.toastTimer = null;
      }, 3000);
    });
  }



  decreaseQuantity(item: CartItem) {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) return;

    const newQuantity = (item.quantity || 1) - 1;
    this.cartService
      .updateCartItemQuantity(userId, item.id, newQuantity)
      .subscribe({
        next: (updatedItem) => {
          if (updatedItem) item.quantity = updatedItem.quantity;
          else this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
        },
        error: (err) => this.showToast(err.error || 'Cannot decrease quantity'),
      });
  }
}
