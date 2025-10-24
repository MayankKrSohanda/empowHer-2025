package com.example.demo.model.DTO;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Data;


@Data
@Builder

public class OrderResponse {
    private Long id;
    private String orderId;
    private Long userId;
    private String orderStatus;
    private String paymentStatus;
    private String paymentMethod;
    private String orderDate;
    private List<OrderProductResponse> items;
    private double totalPrice;
    private String deliveryAddress;
    private String phoNo;

}
