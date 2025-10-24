export interface OrderProduct {
  productId: number;
  productTitle?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id:number;
  orderId: string;
  userId: number;
  orderStatus: string;
  paymentStatus:string;
  paymentMethod:string;
  orderDate: string;
  totalPrice: number;
  deliveryAddress: string;
  phoNo: string;
  items: OrderProduct[];
  showDetails?: boolean;
}
