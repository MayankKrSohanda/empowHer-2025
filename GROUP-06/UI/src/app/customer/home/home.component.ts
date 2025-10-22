import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/model/Product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  allProducts: Product[] = [];
  cart: Product[] = [];
  quantity: number = 1;

  constructor(
    private router: Router,
    private authService: AuthService,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    
  }

  // Load all products initially
  loadProducts(): void {
    this.productService.listAllProducts().subscribe({
      next: (response: Product[]) => {
        console.log('All products:', response);
        this.products = response.map(this.mapProduct);
        this.allProducts = [...this.products];
      },
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  // Map API response to Product object
  private mapProduct(p: any): Product {
    return {
      productId: p.productId,
      title: p.title,
      description: p.description,
      quantity: p.availableQuantity ?? p.quantity ?? 0,
      price: p.price,
      category: p.category ?? '',
      categoryId: p.categoryId,
imageUrl: p.image_url && p.image_url.trim() !== '' 
      ? p.image_url 
      : 'assets/default-image.jpg'  };
  }

  // Called whenever filters are changed in header
  onFiltersChanged(filters: any): void {
  console.log('Filters received in Home:', filters);

  const searchText = filters.searchText?.trim() || '';
  const categoryId = filters.categoryId ? +filters.categoryId : undefined; // ✅ use categoryId emitted by Header
  const minPrice = filters.minPrice !== undefined ? filters.minPrice : undefined;
  const maxPrice = filters.maxPrice !== undefined ? filters.maxPrice : undefined;
  const sortParam = filters.sortBy || '';

  if (searchText) {
    this.productService.searchProducts(searchText).subscribe({
      next: (response: Product[]) => {
        console.log('Search results:', response);
        this.products = response.map(this.mapProduct);
        if (sortParam) this.applyFrontendSort(sortParam);
      },
      error: (err) => console.error('Search API error:', err)
    });
  } else {
    this.productService.filterProducts(categoryId, minPrice, maxPrice).subscribe({
      next: (response: Product[]) => {
        console.log('Filtered products:', response);
        this.products = response.map(this.mapProduct);
        if (sortParam) this.applyFrontendSort(sortParam);
      },
      error: (err) => console.error('Filter API error:', err)
    });
  }
}



  // Frontend sorting fallback
  applyFrontendSort(sortParam: string) {
    if (sortParam === 'lowToHigh' || sortParam === 'priceAsc') {
      this.products.sort((a, b) => a.price - b.price);
    } else if (sortParam === 'highToLow' || sortParam === 'priceDesc') {
      this.products.sort((a, b) => b.price - a.price);
    } else if (sortParam === 'newest') {
      this.products.sort((a, b) => b.productId - a.productId);
    }
  }

  // Add product to cart
  addToCart(product: Product): void {
    if (!product?.productId) {
      console.error('Invalid product ID:', product);
      return;
    }

    const userId = 1; // TODO: get from AuthService

    const cartItemDTO = {
      userId: userId,
      productId: product.productId,
      quantity: this.quantity
    };

    this.cartService.addToCart(cartItemDTO).subscribe({
      next: () => alert(`${product.title} added to cart!`),
      error: (err) => alert('Failed to add to cart: ' + (err?.error?.message || 'Unknown error'))
    });
  }

  // Navigate to product detail page
  viewDetailsEvent(productID: number): void {
    if (productID != null) {
      this.router.navigate(['/customer/product-detail', productID]);
    } else {
      alert('Product ID is missing!');
    }
  }

  
}
