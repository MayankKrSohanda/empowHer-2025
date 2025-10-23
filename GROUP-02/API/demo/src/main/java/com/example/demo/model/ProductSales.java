package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product_sales")
public class ProductSales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", unique = true)
    private Long productId;

    @Column(name = "total_quantity_sold")
    private Integer totalQuantitySold = 0;

    @Column(name = "best_seller")
    private Boolean bestSeller = false;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getTotalQuantitySold() { return totalQuantitySold; }
    public void setTotalQuantitySold(Integer totalQuantitySold) { this.totalQuantitySold = totalQuantitySold; }

    public Boolean isBestSeller() { return bestSeller; }
    public void setBestSeller(Boolean bestSeller) { this.bestSeller = bestSeller; }
}
