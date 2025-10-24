package com.example.demo.model.DTO;

import com.example.demo.model.Product;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Getter;

@Getter
public class ProductDTO {

    private final Long productId;
    private final String title;
    private final String description;
    private final Integer quantity;
    private final Double price;
    private final Long categoryId;
    private final Boolean isActive;
    private final List<String> imgUrls;

    public ProductDTO(Product product,String baseUrl){
        this.productId=product.getProductId();
        this.title=product.getTitle();
        this.description=product.getDescription();
        this.quantity = product.getQuantity();
        this.price = product.getPrice();
        this.categoryId=product.getCategoryId();
        this.isActive = product.getIsActive();
        this.imgUrls = product.getProductImg() == null
                ? Collections.emptyList()
                : product.getProductImg().stream()
                .map(img -> baseUrl + "/api/products/images/" + img.getImgId())
                .collect(Collectors.toList());

    }
}
