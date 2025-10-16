export interface OrderItemDTO {
  productId: number;
  quantity: number;
}

export interface OrderRequestDTO {
  userId: number;
  deliveryAddress: string;
  items: OrderItemDTO[];
}
