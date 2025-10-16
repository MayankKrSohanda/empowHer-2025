package com.example.demo.service;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(Product product){
        return productRepository.save(product);
    }

    public boolean deleteProduct(Integer id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Product findById(Integer id) {
        return productRepository.findById(id).orElse(null);
    }
    public List<Product> findAll(){
        return productRepository.findAll();
    }

    public List<Product> searchByTitle(String title){
        return productRepository.findByTitleContainingIgnoreCase(title);
    }
    public List<Product> filterByCategoryIdAndPrice(Integer categoryId, BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByFilters(
                Optional.ofNullable(categoryId),
                Optional.ofNullable(minPrice),
                Optional.ofNullable(maxPrice)
        );
    }

    public Product updateProduct(Integer id, Product product) {
        Product existing = findById(id);
        if (existing == null) return null;

        existing.setTitle(product.getTitle());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setAvailableQuantity(product.getAvailableQuantity());
        existing.setCategory(product.getCategory());

        return productRepository.save(existing);
    }

}