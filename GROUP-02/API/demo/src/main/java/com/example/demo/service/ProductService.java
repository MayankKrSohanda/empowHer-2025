package com.example.demo.service;

import com.example.demo.model.DTO.ProductDTO;
import com.example.demo.model.Product;
import com.example.demo.model.ProductCategory;
import com.example.demo.repository.ProductCategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;


    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductCategoryRepository categoryRepository;

    private final String IMAGE_FOLDER = "C:/Users/SATHISH AB/Documents/demo-uploads/"; // absolute path

    // ---------------- USER METHODS ----------------
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        orderService.attachBestSellerToProducts(products);
        return products;
    }


    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<Product> searchProducts(String term) {
        return productRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(term, term);
    }

    public List<Product> sortByPriceAsc() {
        return productRepository.findAllByOrderByPriceAsc();
    }

    public List<Product> sortByPriceDesc() {
        return productRepository.findAllByOrderByPriceDesc();
    }

    public List<Product> filterProducts(Long categoryId, Double minPrice, Double maxPrice) {
        return productRepository.findAll().stream()
                .filter(p -> categoryId == null || p.getCategory().getId().equals(categoryId))
                .filter(p -> minPrice == null || p.getPrice().compareTo(BigDecimal.valueOf(minPrice)) >= 0)
                .filter(p -> maxPrice == null || p.getPrice().compareTo(BigDecimal.valueOf(maxPrice)) <= 0)
                .toList();
    }

    // ---------------- ADMIN METHODS ----------------

    public Product addProduct(ProductDTO dto, MultipartFile file) {
        try {
            Product product = new Product();
            product.setTitle(dto.title);
            product.setDescription(dto.description);
            product.setPrice(dto.price);
            product.setQuantity(dto.quantity);
            product.setWeight(dto.weight);
            product.setDimensions(dto.dimensions);
            product.setMaterial(dto.material);

            // Set category
            ProductCategory category = categoryRepository.findById(dto.categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.categoryId));
            product.setCategory(category);

            // Handle image
            if (file != null && !file.isEmpty()) {
                String originalName = file.getOriginalFilename();
                String safeName = originalName.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
                String filename = System.currentTimeMillis() + "_" + safeName;
                File dest = new File(IMAGE_FOLDER + filename);
                file.transferTo(dest);
                product.setImageUrl("/images/" + filename);
            }

            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());
            product.setIsActive(true);

            return productRepository.save(product);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage(), e);
        }
    }

    public Product updateProduct(Long id, Product updatedProduct, MultipartFile file) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        try {
            // Save updated image with safe filename
            if (file != null && !file.isEmpty()) {
                String originalName = file.getOriginalFilename();
                String safeName = originalName.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
                String filename = System.currentTimeMillis() + "_" + safeName;

                File dest = new File(IMAGE_FOLDER + filename);
                file.transferTo(dest);
                existing.setImageUrl("/images/" + filename);
            }

            if (updatedProduct.getTitle() != null) existing.setTitle(updatedProduct.getTitle());
            if (updatedProduct.getDescription() != null) existing.setDescription(updatedProduct.getDescription());
            if (updatedProduct.getPrice() != null) existing.setPrice(updatedProduct.getPrice());
            if (updatedProduct.getQuantity() != null) existing.setQuantity(updatedProduct.getQuantity());
            if (updatedProduct.getCategory() != null) {
                ProductCategory category = categoryRepository.findById(updatedProduct.getCategory().getId())
                        .orElseThrow(() -> new RuntimeException("Category not found with id: " + updatedProduct.getCategory().getId()));
                existing.setCategory(category);
            }
            if (updatedProduct.getWeight() != null) existing.setWeight(updatedProduct.getWeight());
            if (updatedProduct.getDimensions() != null) existing.setDimensions(updatedProduct.getDimensions());
            if (updatedProduct.getMaterial() != null) existing.setMaterial(updatedProduct.getMaterial());
            if (updatedProduct.getIsActive() != null) existing.setIsActive(updatedProduct.getIsActive());

            existing.setUpdatedAt(LocalDateTime.now());
            return productRepository.save(existing);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage(), e);
        }
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}


