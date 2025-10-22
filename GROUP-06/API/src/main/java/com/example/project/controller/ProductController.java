package com.example.project.controller;

import com.example.project.model.Product;
import com.example.project.service.productService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    private final productService productService;

    public ProductController(productService productService) {
        this.productService = productService;
    }

    @GetMapping("/get-all-products")
    public List<Product> listAllProducts() {
        return productService.listAllProducts();
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search-products-by-title")
    public List<Product> listProductsByTitle(@RequestParam(required = false) String title) {
        return productService.listProductsByTitle(title);
    }

    @GetMapping("/filter-products")
    public List<Product> filterProducts(
            @RequestParam(required = false) String categoryId, // accept string from frontend
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        Integer categoryIdInt = null;
        if (categoryId != null && !categoryId.isEmpty()) {
            try {
                categoryIdInt = Integer.parseInt(categoryId); // convert string to integer
            } catch (NumberFormatException e) {
                categoryIdInt = null;
            }
        }

        return productService.filterProducts(categoryIdInt, minPrice, maxPrice);
    }


    @DeleteMapping("/delete-products/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProductById(id);
        if (deleted) return ResponseEntity.ok("Product deleted successfully");
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/admin/add-product")
    public ResponseEntity<Product> addProduct(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("quantity") int quantity,
            @RequestParam("price") int price,
            @RequestParam("categoryId") int categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        Product product = new Product();
        product.setTitle(title);
        product.setDescription(description);
        product.setAvailableQuantity(quantity);
        product.setPrice(price);
        product.setCategoryId(categoryId);

        if (image != null && !image.isEmpty()) {
            productService.handleFileUpload(product, image);  // ✅ must call this
        } else {
            product.setImageUrl("/uploads/default-image.jpg"); // default if no file
        }

        System.out.println(product.getImage_url());
        Product saved = productService.addProduct(product, image);
        return ResponseEntity.ok(saved);
    }


    @PutMapping("/admin/update-product/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @ModelAttribute Product productDetails,  // Automatically maps form fields
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        // Call service to handle partial update
        Product updated = productService.updateProductFields(id, productDetails, image);

        return ResponseEntity.ok(updated);
    }
}



