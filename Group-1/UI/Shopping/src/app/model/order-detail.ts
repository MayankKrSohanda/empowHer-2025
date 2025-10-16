export interface OrderDetail {
  orderId: number;
  userName: string;
  deliveryAddress: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}
