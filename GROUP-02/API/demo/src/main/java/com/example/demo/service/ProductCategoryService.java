package com.example.demo.service;

import com.example.demo.model.ProductCategory;
import com.example.demo.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCategoryService {

    @Autowired
    private ProductCategoryRepository categoryRepository;

    // ✅ List all categories
    public List<ProductCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    // ➕ Add new category
    public ProductCategory addCategory(ProductCategory category) {
        return categoryRepository.save(category);
    }

    // ✏️ Update existing category
    public ProductCategory updateCategory(Long id, ProductCategory updatedCategory) {
        ProductCategory existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        if (updatedCategory.getName() != null) existing.setName(updatedCategory.getName());

        return categoryRepository.save(existing);
    }

    // ❌ Delete category
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
