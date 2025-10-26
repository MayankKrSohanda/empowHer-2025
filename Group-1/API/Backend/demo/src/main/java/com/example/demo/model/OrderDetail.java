package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="orders", schema="empowher_db")
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="order_id")
    private Integer order_id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @Column(name="order_date")
    private LocalDateTime order_date;

    @Column(name="delivery_address")
    private String delivery_address;

    @Column(name="total_amount")
    private BigDecimal total_amount;

    @Column(name="status")
    private String status;

    @OneToMany(mappedBy="order", cascade=CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderProduct> products = new ArrayList<>();

    @Column(name = "create_at", nullable = false, updatable = false)
    private LocalDateTime createAt;

    @Column(name = "update_at", nullable = false)
    private LocalDateTime updateAt;

    public Integer getOrder_id() {
        return order_id;
    }

    public void setOrder_id(Integer order_id) {
        this.order_id = order_id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getOrder_date() {
        return order_date;
    }

    public void setOrder_date(LocalDateTime order_date) {
        this.order_date = order_date;
    }

    public String getDelivery_address() {
        return delivery_address;
    }

    public void setDelivery_address(String delivery_address) {
        this.delivery_address = delivery_address;
    }

    public BigDecimal getTotal_amount() {
        return total_amount;
    }

    public void setTotal_amount(BigDecimal total_amount) {
        this.total_amount = total_amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDateTime createAt) {
        this.createAt = createAt;
    }

    public LocalDateTime getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(LocalDateTime updateAt) {
        this.updateAt = updateAt;
    }

    public List<OrderProduct> getProducts() {
        return products;
    }

    public void setProducts(List<OrderProduct> products) {
        this.products = products;
    }

    public OrderDetail(Integer order_id, User user, LocalDateTime order_date, String delivery_address, BigDecimal total_amount, String status, List<OrderProduct> products, LocalDateTime createAt, LocalDateTime updateAt) {
        this.order_id = order_id;
        this.user = user;
        this.order_date = order_date;
        this.delivery_address = delivery_address;
        this.total_amount = total_amount;
        this.status = status;
        this.products = products;
        this.createAt = createAt;
        this.updateAt = updateAt;
    }

    public OrderDetail() {
    }


}
