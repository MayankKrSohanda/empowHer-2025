package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product_ratings")
public class ProductRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;

    private Long userId;

    private int rating; // 1 to 5

    private String review; // optional review text

    public ProductRating() {}

    public ProductRating(Long productId, Long userId, int rating, String review) {
        this.productId = productId;
        this.userId = userId;
        this.rating = rating;
        this.review = review;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getReview() { return review; }
    public void setReview(String review) { this.review = review; }
}
