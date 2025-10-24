import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { CartItem } from '../model/cart-item';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  selectedQuantity: number = 1;
  cartQuantity: number = 0;
  cartItems: CartItem[] = [];
  currentImageIndex: number = 0;
  quantityOptions: number[] = [];
  toastMessage = '';
  toastType: 'success' | 'danger' | 'info' = 'success';
  showingToast = false;
  toastTimeout: any = null;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Subscribe to cart updates
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.updateCurrentInCart(id);
      if (this.product) this.refreshQuantityOptions(this.product.quantity);
    });

    // Load product details
    this.productService.getProducts({}).subscribe((data) => {
      const found = data.find((p) => p.id === id);
      if (found) {
        this.product = found;
        this.currentImageIndex = 0;
        if (this.product.quantity === 0) {
          this.selectedQuantity = 0;
        } else {
          this.selectedQuantity = 1;
        }
        this.refreshQuantityOptions(this.product.quantity);
        this.updateCurrentInCart(id);
      }
    });
  }

  updateCurrentInCart(productId: number) {
    const cartItem = this.cartItems.find(
      (item) => item.productId === productId
    );
    this.cartQuantity = cartItem ? cartItem.quantity || 0 : 0;
    if (this.product) this.refreshQuantityOptions(this.product.quantity);
  }
  refreshQuantityOptions(stock: number) {
    const inCart = this.cartQuantity || 0;
    const remain = Math.max(0, stock - inCart);
    const maxQty = Math.min(remain, 10);

    if (maxQty <= 0) {
      this.quantityOptions = [];
      // if nothing can be added, set selection to 0
      this.selectedQuantity = 0;
      return;
    }

    this.quantityOptions = Array.from({ length: maxQty }, (_, i) => i + 1);

    // clamp selectedQuantity into available range (1..maxQty)
    if (!this.selectedQuantity || this.selectedQuantity < 1)
      this.selectedQuantity = 1;
    if (this.selectedQuantity > maxQty) this.selectedQuantity = maxQty;
  }

  canAddToCart(): boolean {
    if (!this.product) return false;
    const inCart = this.cartQuantity || 0;
    const selected = Number(this.selectedQuantity) || 0;
    const stock = this.product.quantity || 0;

    return selected > 0 && selected + inCart <= stock;
  }

  onAddToCart(product: Product) {
    const userId = this.authService.getLoggedInUserId();
    if (!userId) {
      this.showToast('Please log in first.', 'danger');
      return;
    }

    this.cartService
      .addToCart(userId, product.id!, this.selectedQuantity)
      .subscribe({
        next: () =>{
                this.showToast(
          `${this.selectedQuantity} × ${product.title} added to cart!`,
          'success'
                );
        },
          
        error: () => this.showToast('Failed to add to cart. Try again.', 'danger'),
      });
  }
showToast(message: string, type: 'success' | 'danger' | 'info' = 'info', duration = 3000) {
  // clear any previous timer
  if (this.toastTimeout) {
    clearTimeout(this.toastTimeout);
    this.toastTimeout = null;
  }

  this.toastMessage = message;
  this.toastType = type;
  this.showingToast = true;

  // auto-hide
  this.toastTimeout = setTimeout(() => {
    this.showingToast = false;
    this.toastTimeout = null;
  }, duration);
}

  hasImages(): boolean {
    return !!(
      this.product &&
      this.product.productImg &&
      this.product.productImg.length > 0
    );
  }

  hasMultipleImages(): boolean {
    return !!(
      this.product &&
      this.product.productImg &&
      this.product.productImg.length > 1
    );
  }
  hideToast() {
  if (this.toastTimeout) {
    clearTimeout(this.toastTimeout);
    this.toastTimeout = null;
  }
  this.showingToast = false;
}

  currentImageUrl(): string {
    if (this.product?.productImg && this.product.productImg.length > 0) {
      // ensure index in bounds
      if (this.currentImageIndex < 0) this.currentImageIndex = 0;
      if (this.currentImageIndex >= this.product.productImg.length) {
        this.currentImageIndex = 0;
      }
      return this.product.productImg[this.currentImageIndex].url;
    }
    return 'assets/no-image.png';
  }
  nextImage(): void {
    if (!this.product?.productImg?.length) return;
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.product.productImg.length;
  }

  prevImage(): void {
    if (!this.product?.productImg?.length) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.product.productImg.length) %
      this.product.productImg.length;
  }
}
