package com.example.project.controller.ResposeObject;

import lombok.Data;

@Data
public class ProductDTO {
    private Long productId;
    private String title;
    private String description;
    private int availableQuantity;
    private int price;
    private int categoryId;
    private boolean isActive;
    private String categoryName;
}
