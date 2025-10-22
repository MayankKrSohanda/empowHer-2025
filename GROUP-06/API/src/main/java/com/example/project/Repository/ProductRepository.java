package com.example.project.Repository;


import com.example.project.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ProductRepository extends JpaRepository<Product,Long>{
    //find all the products
    List<Product> findAll();
    List<Product> findByTitleContainingIgnoreCase(String title);

    List<Product> findByCategoryId(int categoryId);
    List<Product> findByPriceBetween(int minPrice, int maxPrice);

    //List<Product> findByUserId(Long userId);
}