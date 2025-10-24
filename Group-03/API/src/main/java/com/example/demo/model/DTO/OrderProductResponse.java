package com.example.demo.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderProductResponse {
    private final Long productId;
    private final Integer quantity;
    private final Double price;
}
