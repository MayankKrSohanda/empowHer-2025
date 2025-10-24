package com.example.demo.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemDTO {
    private Long id;
    private Long userId;
    private Long productId;
    private int quantity;
    private String productTitle;
    private double productPrice;
    private int prodAvailQuantity;

}
