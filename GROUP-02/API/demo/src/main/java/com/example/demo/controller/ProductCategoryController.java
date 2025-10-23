package com.example.demo.controller;

import com.example.demo.model.ProductCategory;
import com.example.demo.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductCategoryController {

    @Autowired
    private ProductCategoryService categoryService;

    // List all categories
    @GetMapping
    public List<ProductCategory> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // Add new category
    @PostMapping
    public ProductCategory addCategory(@RequestBody ProductCategory category) {
        return categoryService.addCategory(category);
    }

    // Update category
    @PutMapping("/{id}")
    public ProductCategory updateCategory(@PathVariable Long id, @RequestBody ProductCategory category) {
        return categoryService.updateCategory(id, category);
    }

    // Delete category
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return "Category deleted successfully!";
    }
}
