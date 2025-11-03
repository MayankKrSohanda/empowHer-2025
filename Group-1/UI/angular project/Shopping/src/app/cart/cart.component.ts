import { Component, OnInit } from "@angular/core";
import { CartService } from "../services/cart.service";
import { CartItem } from "../model/cartItem";
import { Router } from "@angular/router";
import { OrderService } from "../services/order.service";
import { Product } from "../model/product";
import { ProductService } from "../services/product.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  userId: number = 1;
  deliveryAddress: string = "";
  products:Map<number,Product>=new Map();

  constructor(private cartService: CartService, private router: Router, private orderService: OrderService, private productService:ProductService) { }

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems(): void {
    this.cartService.getCartItems(this.userId).subscribe({
      next: (items) => {
        this.cartItems = items;

        items.forEach(item=>{
          this.productService.getProductById(item.productId).subscribe(prod=>{
            this.products.set(item.productId,prod);
          });
        });
      },
      error: (err) => {
        console.error('Error fetching cart items', err);
      }
    });
  }

  calculateTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  }

  removeFromCart(cartItemId: number): void {
    this.cartService.removeItem(cartItemId).subscribe({
      next: () => {
        this.cartItems = [...this.cartItems.filter(item => item.cartItemId !== cartItemId)];
      },
      error: (err) => {
        console.error('Error removing item', err);
      }
    });
  }

  placeOrder(): void {
  if (this.cartItems.length === 0) {
    console.warn("Cart is already empty");
    return;
  }

  // Clear local cart items
  this.cartItems = [];

  // ✅ Clear the product map as well
  this.products.clear();

  // Optional: Clear cart on backend
  this.cartService.clearCart(this.userId).subscribe({
    next: () => console.log("Cart cleared on backend"),
    error: (err) => console.error("Error clearing cart", err)
  });

  // Navigate to order-details page
  this.router.navigateByUrl('/order-details');
}


  getProductImage(item:CartItem): string{
    const product=this.products.get(item.productId);
    return product?.image||"assets/Screenshot 2025-09-14 000242.png";
  }

}