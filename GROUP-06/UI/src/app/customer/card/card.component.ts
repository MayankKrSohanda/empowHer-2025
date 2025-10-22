import { Product } from 'src/app/model/Product';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() product!: Product;
  @Output() viewDetails = new EventEmitter<number>();
  quantity:number=1;

 constructor(private cartService: CartService) {}

onAddToCart(product: Product) {
    // Replace this with actual logged-in user's ID
    const userId = 1; // TODO: get from AuthService

    const cartItemDTO = {
      userId: userId,
      productId: product.productId,
      quantity: this.quantity
    };

    this.cartService.addToCart(cartItemDTO).subscribe({
      next: (response) => this.showBootstrapAlert(`${product.title} added to cart!`),
      error: (err) => this.showBootstrapAlert('Failed to add to cart: ' + (err?.error?.message || 'Unknown error'))
    });
  }

  viewDetailsEvent() {
    console.log('Card clicked, emitting product id:', this.product?.productId);
    console.log(this.product.imageUrl);
    if (this.product && this.product.productId !== undefined && this.product.productId !== null) {
      this.viewDetails.emit(this.product.productId);
    }
  }


  showBootstrapAlert(message: string, type: string = 'info'): void {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
      console.error('⚠️ Alert container not found in DOM');
      return;
    }

    // Clear old alert
    alertContainer.innerHTML = '';

    // Create Bootstrap alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show text-center mt-3`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.textContent = message;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close';
    closeBtn.setAttribute('data-bs-dismiss', 'alert');
    closeBtn.setAttribute('aria-label', 'Close');
    alertDiv.appendChild(closeBtn);

    alertContainer.appendChild(alertDiv);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      alertDiv.classList.remove('show');
      alertDiv.classList.add('hide');
      alertDiv.remove();
    }, 3000);
  }

}


