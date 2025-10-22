package com.example.project.controller.ResposeObject;

import com.example.project.model.Order;
import com.example.project.model.OrderProduct;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class OrderDTO {
    private Long orderId;
    private Long userId;
    private LocalDate orderDate;
    private String deliveryAddress;
    private Double totalAmount;
    private String status;
    private List<OrderProductDTO> orderProducts;
    public OrderDTO(){}
    public OrderDTO(Order order) {
        this.orderId = order.getOrderId();
        this.userId = order.getUser().getUserId();
        this.orderDate = order.getOrderDate();
        this.deliveryAddress = order.getDeliveryAddress();
        this.totalAmount = order.getTotalAmount();
        this.status = order.getStatus();

        // Convert OrderProducts to DTOs
        this.orderProducts = new ArrayList<>();
        for (OrderProduct op : order.getOrderProducts()) {
            this.orderProducts.add(new OrderProductDTO(op));
        }
    }
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<OrderProductDTO> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(List<OrderProductDTO> orderProducts) {
        this.orderProducts = orderProducts;
    }
}
