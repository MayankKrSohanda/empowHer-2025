package com.example.project.controller.ResposeObject;

import com.example.project.model.OrderProduct;

public class OrderProductDTO {
    private Long productId;
    private Integer quantity;
    private Double price;



    public OrderProductDTO() {}

    public OrderProductDTO(OrderProduct orderProduct) {
        this.productId = orderProduct.getProductId();

        this.quantity = orderProduct.getQuantity();
        this.price = orderProduct.getPrice();
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
