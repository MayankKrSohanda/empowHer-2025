import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../model/product";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    private apiUrl = 'http://localhost:8080/api/products';

    constructor(private http: HttpClient) { }

    cartItems: { product: Product, quantity: Number }[] = [];

    private searchQuery= new BehaviorSubject<string>('');
    searchQuery$ =this.searchQuery.asObservable();

    setSearch(query:string){
        this.searchQuery.next(query);
    }

    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>('http://localhost:8080/api/products/get-products');
    }
    getFilteredProducts(categoryId?: number, minPrice?: number, maxPrice?: number): Observable<Product[]> {
        let params = new HttpParams();
        if (categoryId) params = params.set('category_id', categoryId.toString());
        if (minPrice) params = params.set('min_price', minPrice.toString());
        if (maxPrice) params = params.set('max_price', maxPrice.toString());

        return this.http.get<Product[]>(`${this.apiUrl}/get-products`, { params });
    }
    getProductByTitle(title: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/get-products`, {
            params: new HttpParams().set('title', title)
        });
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }
    addProduct(formData: FormData): Observable<Product> {
        return this.http.post<Product>(`${this.apiUrl}/add-product`, formData);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete-product/${id}`);
    }
    updateProduct(id: number, product: Product): Observable<Product> {
  return this.http.put<Product>(`${this.apiUrl}/update-product/${id}`, product);
}

}