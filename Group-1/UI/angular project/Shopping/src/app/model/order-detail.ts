export interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderDetail {
  orderId: number;
  userName: string;
  deliveryAddress: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}
