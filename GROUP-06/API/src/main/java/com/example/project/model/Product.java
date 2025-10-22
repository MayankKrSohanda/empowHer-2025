package com.example.project.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="Products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="product_id")
    private Long productId;
    @Column(name="title")
    private String title;
    @Column(name="description")
    private String description;
    @Column(name="available_quantity")
    private int availableQuantity;

    @Column(name="image_url")
    private String image_url;
    @Column(name="price")
    private int price;
    @Column(name="category_id")
    private int categoryId;
    @Column(name="is_active")
    private boolean isActive;


    public Long getProductId() {
        return productId;
    }

    public Product() {
    }

    public Product(Long productId, String title, String description, int availableQuantity, int price, int categoryId, boolean isActive) {
        this.productId = productId;
        this.title = title;
        this.description = description;
        this.availableQuantity = availableQuantity;
        this.price = price;
        this.categoryId = categoryId;
        this.isActive = isActive;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(int availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }



    public void setImageUrl(String image_url) {
        this.image_url=image_url;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }
}
//package com.example_empowher.empowher.model;
//
//import jakarta.persistence.*;
//
//@Entity
//@Table(name = "Products")
//public class Product {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "product_id")
//    private int productId;
//
//    @Column(name = "title")
//    private String title;
//
//    @Column(name = "description")
//    private String description;
//
//    @Column(name = "available_quantity")
//    private int availableQuantity;
//
//    @Column(name = "price")
//    private int price;
//
//    @Column(name = "category_id")
//    private int categoryId;
//
//    @Column(name = "is_active")
//    private boolean isActive;
//
//    // Default constructor (REQUIRED by JPA)
//    public Product() {}
//
//    // Constructor with all fields
//    public Product(String title, String description, int availableQuantity, int price, int categoryId, boolean isActive) {
//        this.title = title;
//        this.description = description;
//        this.availableQuantity = availableQuantity;
//        this.price = price;
//        this.categoryId = categoryId;
//        this.isActive = isActive;
//    }
//
//    // Getters and Setters
//    public int getProductId() {
//        return productId;
//    }
//
//    public void setProductId(int productId) {
//        this.productId = productId;
//    }
//
//    public String getTitle() {
//        return title;
//    }
//
//    public void setTitle(String title) {
//        this.title = title;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public int getAvailableQuantity() {
//        return availableQuantity;
//    }
//
//    public void setAvailableQuantity(int availableQuantity) {
//        this.availableQuantity = availableQuantity;
//    }
//
//    public int getPrice() {
//        return price;
//    }
//
//    public void setPrice(int price) {
//        this.price = price;
//    }
//
//    public int getCategoryId() {
//        return categoryId;
//    }
//
//    public void setCategoryId(int categoryId) {
//        this.categoryId = categoryId;
//    }
//
//    public boolean isActive() {
//        return isActive;
//    }
//
//    public void setActive(boolean active) {
//        isActive = active;
//    }
//
//    @Override
//    public String toString() {
//        return "Product{" +
//                "productId=" + productId +
//                ", title='" + title + '\'' +
//                ", description='" + description + '\'' +
//                ", availableQuantity=" + availableQuantity +
//                ", price=" + price +
//                ", categoryId=" + categoryId +
//                ", isActive=" + isActive +
//                '}';
//    }
//}
