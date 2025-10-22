package com.example.project.model;


import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
    @Table(name = "orders")
    public class Order {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "order_id")
        private Long orderId;

        @Column(name = "order_date")
        private LocalDate orderDate;

        @Column(name = "delivery_addres")
        private String deliveryAddress;

        @Column(name = "total_amount")
        private Double totalAmount;

        @Column(name = "status")
        private String status;

        @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
        private List<OrderProduct> orderProducts;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

        // Getters and setters

    public Order() {
    }

    public Order(Long orderId, User user, LocalDate orderDate, String deliveryAddress, Double totalAmount, String status, List<OrderProduct> orderProducts) {
        this.orderId = orderId;
        this.user = user;
        this.orderDate = orderDate;
        this.deliveryAddress = deliveryAddress;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderProducts = orderProducts;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public List<OrderProduct> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(List<OrderProduct> orderProducts) {
        this.orderProducts = orderProducts;
    }
    public void addOrderProduct(OrderProduct op) {
        op.setOrder(this); // link child to parent
        this.orderProducts.add(op);
    }
}

