package com.example.demo.repository;

import com.example.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {
    List<Product> findByTitleContainingIgnoreCase(String title);
    List<Product> findByCategoryIdAndPriceBetween(Long categoryId, Double minPrice, Double maxPrice);
    Product findTopByCategoryIdOrderByPriceDesc(Long categoryId);
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

}
