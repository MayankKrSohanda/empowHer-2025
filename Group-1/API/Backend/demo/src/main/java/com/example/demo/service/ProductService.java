package com.example.demo.service;

import com.example.demo.model.Product;
import com.example.demo.model.ProductCategory;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    public ProductService(ProductRepository productRepository, ProductCategoryRepository productCategoryRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
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
        existing.setActive(product.isActive());

        // Load the category from the database if category id is provided
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Optional<ProductCategory> categoryOpt = productCategoryRepository.findById(product.getCategory().getId());
            if (categoryOpt.isPresent()) {
                existing.setCategory(categoryOpt.get());
            }
        }

        return productRepository.save(existing);
    }

    public long getProductCount() {
        return productRepository.count();
    }

}