package com.example.demo.repository;

import com.example.demo.model.ProductSales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductSalesRepository extends JpaRepository<ProductSales, Long> {
    ProductSales findByProductId(Long productId);
}
