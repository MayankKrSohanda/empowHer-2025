export interface Order {
  id: number;
  userId: number;
  paymentMode: string;
  deliveryAddress: string;
  contactNumber: string;
  totalAmount: number;
  createdAt: string;   // 👈 add this
  items: {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
  }[];
}
