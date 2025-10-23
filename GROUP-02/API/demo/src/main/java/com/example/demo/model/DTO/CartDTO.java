package com.example.demo.model.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

public class CartDTO {
    private Long userId;
    private Long productId;
    private int quantity = 1;
    private String imageUrl;
    // default 1


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
