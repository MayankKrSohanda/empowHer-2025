package com.example.demo.controller;

import com.example.demo.model.DTO.ProductDTO;
import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    @Autowired
    private ProductService productService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ---------------- USER METHODS ----------------
    @GetMapping("/list")
    public List<Product> getAllProducts() { return productService.getAllProducts(); }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) { return productService.getProductById(id); }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String term) { return productService.searchProducts(term); }

    @GetMapping("/sort/asc")
    public List<Product> sortByPriceAsc() { return productService.sortByPriceAsc(); }

    @GetMapping("/sort/desc")
    public List<Product> sortByPriceDesc() { return productService.sortByPriceDesc(); }

    @GetMapping("/filter")
    public List<Product> filterProducts(@RequestParam(required = false) Long categoryId,
                                        @RequestParam(required = false) Double minPrice,
                                        @RequestParam(required = false) Double maxPrice) {
        return productService.filterProducts(categoryId, minPrice, maxPrice);
    }

    // ---------------- ADMIN METHODS ----------------
    @PostMapping(value = "/add-with-image", consumes = {"multipart/form-data"})
    public Product addProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        try {
            // Map JSON to a temporary DTO
            ObjectMapper mapper = new ObjectMapper();
            ProductDTO dto = mapper.readValue(productJson, ProductDTO.class);
            return productService.addProduct(dto, file);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing product JSON: " + e.getMessage(), e);
        }
    }




    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id,
                                 @RequestPart("product") String productJson,
                                 @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            Product product = objectMapper.readValue(productJson, Product.class);
            return productService.updateProduct(id, product, file);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing product JSON: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "Product deleted successfully!";
    }

    @PostMapping("/{id}/upload-image")
    public Product uploadImage(@PathVariable Long id, @RequestPart("file") MultipartFile file) {
        Product product = productService.getProductById(id);
        return productService.updateProduct(id, product, file);
    }


}
