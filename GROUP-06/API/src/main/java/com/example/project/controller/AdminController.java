//package com.example.project.controller;
//
//import com.example.project.model.Product;
//import com.example.project.service.productService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/admin/products")
//@CrossOrigin(origins = "*")
//public class AdminController {
//
//    @Autowired
//    private productService ProductService;
//
//    // Add Product
//    @PostMapping("/addProduct")
//    public ResponseEntity<Product> addProduct(
//            @RequestParam("title") String title,
//            @RequestParam("description") String description,
//            @RequestParam("availableQuantity") int availableQuantity,
//            @RequestParam("price") int price,
//            @RequestParam("categoryId") Long categoryId, // Added categoryId
//            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
//
//        Product product = new Product();
//        product.setTitle(title);
//        product.setDescription(description);
//        product.setAvailableQuantity(availableQuantity);
//        product.setPrice(price);
//        Product savedProduct = ProductService.addProduct(product, categoryId, file);
//        return ResponseEntity.ok(savedProduct);
//    }
//
//
//    // Update Product
//    @PutMapping("/{id}")
//    public ResponseEntity<Product> updateProduct(
//            @PathVariable Long id,
//            @RequestParam("title") String title,
//            @RequestParam("description") String description,
//            @RequestParam("availableQuantity") int availableQuantity,
//            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
//
//        Product product = new Product();
//        product.setTitle(title);
//        product.setDescription(description);
//        product.setAvailableQuantity(availableQuantity);
//
//        Product updatedProduct = ProductService.updateProduct(id, product, file);
//        return ResponseEntity.ok(updatedProduct);
//    }
//
//    // Delete Product
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
//        ProductService.deleteProduct(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    // Get Single Product
//    @GetMapping("/{id}")
//    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
//        return ProductService.getProduct(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // Get All Products
//    @GetMapping
//    public List<Product> getAllProducts() {
//        return ProductService.getAllProducts();
//    }
//}
