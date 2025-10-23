export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string; // make it mandatory, backend always sends it now
}
