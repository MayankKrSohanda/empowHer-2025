package com.example.demo.repository;

import com.example.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product,Integer> {
    List<Product> findByTitleContainingIgnoreCase(String title);
    Optional<Product> findProductById(Integer productId);
    @Query("SELECT p FROM Product p WHERE " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Product> findByFilters(
            @Param("categoryId") Optional<Integer> categoryId,
            @Param("minPrice") Optional<BigDecimal> minPrice,
            @Param("maxPrice") Optional<BigDecimal> maxPrice
    );
}
