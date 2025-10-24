package com.example.demo.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    private Long id;
    private Long userId;
    private Double totalPrice;
    private LocalDateTime orderDate;
    private String orderStatus;
    private String paymentStatus;
    private String deliveryAddress;
    private String phoneNumber;
    private String paymentMethod;
    private String orderNotes;

    private List<OrderProductRequest> items;

}

