import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Product } from '../model/product';

export interface SearchCriteria {
  title?: string | null;
  categoryId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
  active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';
  private categoriesUrl = 'http://localhost:8080/api/categories';

  // Subjects act as local cache + reactive stream for components
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Fetch products from backend (returns Observable).
   * Also updates the productsBehaviorSubject via tap.
   */
  getProducts(criteria: SearchCriteria = {}): Observable<Product[]> {
    let params = new HttpParams();
    if (criteria.title) params = params.set('title', criteria.title);
    if (criteria.categoryId != null)
      params = params.set('categoryId', String(criteria.categoryId));
    if (criteria.minPrice != null)
      params = params.set('minPrice', String(criteria.minPrice));
    if (criteria.maxPrice != null)
      params = params.set('maxPrice', String(criteria.maxPrice));

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      map((products) =>
        products.map((p) => ({
          id: p.productId,
          title: p.title,
          description: p.description,
          quantity: p.quantity ?? 1,
          price: p.price,
          categoryId: p.categoryId,
          isActive: p.isActive,
          // p.imgUrls is expected to be an array of full URLs (as your backend's DTO provides)
          productImg:
            p.imgUrls?.map((url: string, idx: number) => ({ id: idx, url })) ||
            [],
        }))
      ),
      tap((mappedProducts) => this.productsSubject.next(mappedProducts))
    );
  }

  /**
   * Trigger the HTTP fetch and update the products subject.
   * Call this from components when you want to ensure fresh data (e.g. on init).
   */
  loadProducts(criteria: SearchCriteria = {}): void {
    this.getProducts(criteria).subscribe({
      next: () => {}, // productsSubject updated inside getProducts()
      error: (err) => console.error('Failed to load products', err),
    });
  }

  /**
   * Add product. The returned observable maps backend DTO -> Product.
   * Also appends to productsSubject via tap for immediate UI update.
   */
  addProduct(productForm: FormData): Observable<Product> {
    return this.http.post<any>(this.apiUrl, productForm).pipe(
      map((p) => ({
        id: p.productId,
        title: p.title,
        description: p.description,
        quantity: p.quantity,
        price: p.price,
        categoryId: p.categoryId,
        isActive: p.isActive,
        productImg:
          p.imgUrls?.map((url: string, idx: number) => ({ id: idx, url })) ||
          [],
      })),
      tap((newProd) => {
        const current = this.productsSubject.value;
        this.productsSubject.next([...current, newProd]);
      })
    );
  }

  /**
   * Update product. Returns updated Product and replaces it in the BehaviorSubject.
   */
  updateProduct(id: number, productForm: FormData): Observable<Product> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, productForm).pipe(
      map((p) => ({
        id: p.productId,
        title: p.title,
        description: p.description,
        quantity: p.quantity ?? 1,
        price: p.price,
        categoryId: p.categoryId,
        isActive: p.isActive,
        productImg:
          p.imgUrls?.map((url: string, idx: number) => ({ id: idx, url })) ||
          [],
      })),
      tap((updatedProd) => {
        const current = this.productsSubject.value.map((x) =>
          x.id === updatedProd.id ? updatedProd : x
        );
        this.productsSubject.next(current);
      })
    );
  }

  /**
   * Delete product: calls backend and removes from BehaviorSubject.
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.productsSubject.value.filter((p) => p.id !== id);
        this.productsSubject.next(current);
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.categoriesUrl)
      .pipe(tap((cats) => this.categoriesSubject.next(cats)));
  }

  loadCategories(): void {
    this.getCategories().subscribe({
      next: () => {},
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  addCategory(name: string): Observable<Category> {
    return this.http
      .post<Category>(this.categoriesUrl, { categoryName: name })
      .pipe(
        tap((newCat) => {
          const current = this.categoriesSubject.value;
          this.categoriesSubject.next([...current, newCat]);
        })
      );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriesUrl}/${id}`).pipe(
      tap(() => {
        const current = this.categoriesSubject.value.filter(
          (c) => c.categoryId !== id
        );
        this.categoriesSubject.next(current);
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((p: any) => ({
        id: p.productId,
        title: p.title,
        description: p.description,
        quantity: p.quantity ?? 1,
        price: p.price,
        categoryId: p.categoryId,
        isActive: p.isActive,
        productImg:
          p.imgUrls?.map((url: string, idx: number) => ({ id: idx, url })) ||
          [],
      }))
    );
  }
}
