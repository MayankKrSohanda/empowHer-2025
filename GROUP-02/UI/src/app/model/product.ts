import { environment } from '../../environments/environment';
import { ProductCategory } from './product-category';

export class Product {
  id!: number;
  title!: string;
  description!: string;
  price!: number;
  imageUrl!: string;
  categoryId!: number;
  categoryName?: string;
  quantity!: number;
  category: ProductCategory = { id: 0, name: '' }; // initialize
  name?: string;
  bestSeller?: boolean;

  get fullImageUrl(): string {
    if (!this.imageUrl) return '';
    return `${environment.apiBaseUrl}${this.imageUrl.startsWith('/') ? '' : '/'}${this.imageUrl}`;
  }
}
