import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  listAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/get-all-products`);
  }
 getProductById(id: number | string) {
  // return this.http.get<Product>(`/api/products/${id}`);
  return this.http.get<Product>(`http://localhost:8080/api/products/${id}`);

}
  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search-products-by-title`, {
      params: { title: searchTerm }
    });
  }
filterProducts(categoryId?: number, minPrice?: number, maxPrice?: number): Observable<Product[]> {
  let params = new HttpParams();

  if (categoryId) {
    params = params.set('categoryId', categoryId.toString()); // ✅ backend expects categoryId
  }
  if (minPrice != null) {
    params = params.set('minPrice', minPrice.toString());
  }
  if (maxPrice != null) {
    params = params.set('maxPrice', maxPrice.toString());
  }

  console.log('Calling filter-products with:', `${this.apiUrl}/filter-products?${params.toString()}`);

  return this.http.get<Product[]>(`${this.apiUrl}/filter-products`, { params });
}

 addProduct(productData: FormData): Observable<Product> {
  return this.http.post<Product>(`${this.apiUrl}/admin/add-product`, productData);
}


  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/update-product/${product.productId}`, product);
  }

  deleteProduct(id: number) {
  return this.http.delete(`http://localhost:8080/api/delete-products/${id}`, { responseType: 'text' });
}

}
