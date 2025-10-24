package com.example.demo.service;

import com.example.demo.FileStorageService;
import com.example.demo.model.DTO.ProductDTO;
import com.example.demo.model.ImageModel;
import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    private List<ProductDTO> mapToDTO(List<Product> products, String baseUrl) {
        return products.stream()
                .map(product -> new ProductDTO(product, baseUrl))
                .collect(Collectors.toList());
    }
    @Autowired
    private FileStorageService fileStorageService;

    private Set<ImageModel> saveImages(MultipartFile[] files,Product product){
        Set<ImageModel> imgModels = new HashSet<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            ImageModel imgModel = fileStorageService.storeFile(file);
            imgModel.setProduct(product);
            imgModels.add(imgModel);
        }
        return imgModels;
    }
    public Product addProduct(Product product, MultipartFile[] files) {
        if (files != null && files.length > 0) {
            product.setProductImg(saveImages(files,product));
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updateProduct, MultipartFile[] files) {
        return productRepository.findById(id).map(existing -> {
            existing.setTitle(updateProduct.getTitle());
            existing.setDescription(updateProduct.getDescription());
            existing.setQuantity(updateProduct.getQuantity());
            existing.setPrice(updateProduct.getPrice());
            existing.setCategoryId(updateProduct.getCategoryId());
            existing.setIsActive(updateProduct.getIsActive());

            if (files != null && files.length > 0) {
                // Optionally clear existing images (and delete files) if you want replacement
                existing.getProductImg().clear();
                existing.getProductImg().addAll(saveImages(files,existing));
            }

            return productRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<ProductDTO> listProducts(String baseUrl) {
        return mapToDTO(productRepository.findAll(),baseUrl);
    }

    public List<ProductDTO> searchProductsByTitle(String title,String baseUrl) {
        List<Product> products=productRepository.findByTitleContainingIgnoreCase(title);
        return mapToDTO(products,baseUrl);
    }

    public List<ProductDTO> filterProducts(Long categoryId, Double minPrice, Double maxPrice,String baseUrl) {
        if (minPrice == null) minPrice = 0.0;
        if (maxPrice == null) maxPrice=Double.MAX_VALUE;
        List<Product> products;
        if (categoryId != null) {
            products= productRepository.findByCategoryIdAndPriceBetween(categoryId, minPrice, maxPrice);
        } else {
            products= productRepository.findByPriceBetween(minPrice, maxPrice);
        }
        return mapToDTO(products,baseUrl);
    }

    public Optional<Product> getProductById(Long id){
        return productRepository.findById(id);
    }

    public boolean deleteProduct(Long id){
        Optional<Product> opt = productRepository.findById(id);
        if (opt.isPresent()){
            Product product = opt.get();

            // delete files from disk for each image
            if (product.getProductImg() != null) {
                for (ImageModel img : product.getProductImg()) {
                    try {
                        fileStorageService.deleteFile(img.getImgPath()); // implement deleteFile
                    } catch (Exception ignored) {}
                }
            }

            // delete product (cascade = ALL will remove image rows)
            productRepository.delete(product);
            return true;
        }
        return false;
    }



}
