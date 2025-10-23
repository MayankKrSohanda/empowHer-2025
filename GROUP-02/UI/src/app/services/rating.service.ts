import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:8080/api/ratings';

  constructor(private http: HttpClient) {}

  addRating(productId: number, userId: number, rating: number, review?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { productId, userId, rating, review });
  }

  getRatingsForProduct(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product/${productId}`);
  }

  getAverageRating(productId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/average/${productId}`);
  }
}
