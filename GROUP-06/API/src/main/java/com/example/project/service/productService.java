package com.example.project.service;

import com.example.project.Repository.ProductRepository;
import com.example.project.model.Product;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@Service
public class productService {

    private final ProductRepository productRepository;
    private static final String UPLOAD_DIR = "uploads/";

    public productService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> listAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public boolean deleteProductById(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Product> listProductsByTitle(String title) {
        if (title == null || title.isEmpty()) return listAllProducts();
        return productRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Product> filterProducts(Integer categoryId, Double minPrice, Double maxPrice) {
        List<Product> products;

        if (categoryId != null && categoryId > 0) {
            products = productRepository.findByCategoryId(categoryId);
        } else {
            products = productRepository.findAll();
        }

        if (minPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() >= minPrice)
                    .toList();
        }
        if (maxPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() <= maxPrice)
                    .toList();
        }

        return products;
    }

    // Add Product
    public Product addProduct(Product product, MultipartFile file) throws IOException {
        handleFileUpload(product, file);
        return productRepository.save(product);
    }

    // Update Product
    public Product updateProductFields(Long id, Product productDetails, MultipartFile file) throws IOException {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (productDetails.getTitle() != null) {
            existing.setTitle(productDetails.getTitle());
        }
        if (productDetails.getDescription() != null) {
            existing.setDescription(productDetails.getDescription());
        }
        if (productDetails.getPrice() != 0) {
            existing.setPrice(productDetails.getPrice());
        }
        if (productDetails.getAvailableQuantity() != 0) {
            existing.setAvailableQuantity(productDetails.getAvailableQuantity());
        }
        if (productDetails.getCategoryId() != 0) {
            existing.setCategoryId(productDetails.getCategoryId());
        }

        if (file != null && !file.isEmpty()) {
            handleFileUpload(existing, file); // use the same method to handle upload
        }

        return productRepository.save(existing);
    }

    // Delete Product
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Handle file upload
    public void handleFileUpload(Product product, MultipartFile file) throws IOException {
        if (file != null && !file.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Store relative URL for frontend
            product.setImageUrl("/uploads/" + fileName);
        }
    }
}
