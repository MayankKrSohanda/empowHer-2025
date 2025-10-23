import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { ProductCategory } from '../model/product-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) {}

  // ---------------- USER OPERATIONS ----------------
  listProducts(): Observable<Product[]> {
    // Backend now returns bestSeller in Product
    return this.http.get<Product[]>(`${this.apiUrl}/products/list`);
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.apiUrl}/categories`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  searchProducts(term: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/search`, { params: { term } });
  }

  filterProducts(categoryId?: number, minPrice?: number, maxPrice?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    if (minPrice) params = params.set('minPrice', minPrice.toString());
    if (maxPrice) params = params.set('maxPrice', maxPrice.toString());
    return this.http.get<Product[]>(`${this.apiUrl}/products/filter`, { params });
  }

  // ---------------- ADMIN OPERATIONS ----------------
  addProduct(product: Product, file?: File): Observable<Product> {
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    if (file) formData.append('file', file);
    return this.http.post<Product>(`${this.apiUrl}/products/add-with-image`, formData);
  }

  updateProduct(id: number, product: Product, file?: File): Observable<Product> {
    const formData = new FormData();
    const productToSend: any = {
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: { id: product.categoryId },
    };
    formData.append('product', JSON.stringify(productToSend));
    if (file) formData.append('file', file);
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, formData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`, { responseType: 'text' });
  }

  uploadProductImage(productId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/products/${productId}/upload-image`, formData);
  }

  getProductSales(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/product-sales`);
}

}
