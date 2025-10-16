package com.example.demo.controller;

import com.example.demo.model.DTO.ProductResponse;
import com.example.demo.model.ImageModel;
import com.example.demo.model.Product;
import com.example.demo.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(
        origins = "http://localhost:4200",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService){
        this.productService=productService;
    }

//    @PostMapping("/add-product")
//    public ResponseEntity<Product> addProduct(@RequestBody Product product){
//        System.out.println("📦 Incoming Product: " + product);
//
//        Product addpro=productService.addProduct(product);
//        return ResponseEntity.status(HttpStatus.CREATED).body(addpro);
//    }
    @PostMapping(value = "/add-product", consumes ={MediaType.MULTIPART_FORM_DATA_VALUE} )
    public Product addProduct(@RequestPart("product") Product product,
                                              @RequestPart("imageFile")MultipartFile[] file){
//        Product addpro=productService.addProduct(product);
//        return ResponseEntity.status(HttpStatus.CREATED).body(addpro);
        try{
            Set<ImageModel> images = uploadImage(file);
            product.setProductImages(images);
            return productService.addProduct(product);
        }catch(Exception e){
            System.out.println(e.getMessage());
            return null;
        }

    }
    public Set<ImageModel> uploadImage(MultipartFile[] multipartFiles) throws IOException {
        Set<ImageModel> imageModels=new HashSet<>();

        for(MultipartFile file:multipartFiles){
            ImageModel imageModel=new ImageModel(
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getBytes()
            );
            imageModels.add(imageModel);
        }
        return imageModels;
    }

    @DeleteMapping("/delete-product/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id){
        System.out.println("📦 Incoming id: " + id);

        if(productService.deleteProduct(id)){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/get-products")
    public ResponseEntity<List<ProductResponse>> getProduct(
            @RequestParam(required = false) String title,
            @RequestParam(name = "category_id",required = false) Integer category_id,
            @RequestParam(name = "min_price",required = false) BigDecimal min_price,
            @RequestParam(name = "max_price",required = false) BigDecimal max_price){

        List<Product>products;
        if(title != null && !title.isEmpty()){
            products = productService.searchByTitle(title);
        }else if(category_id != null || min_price != null || max_price != null){
            products = productService.filterByCategoryIdAndPrice(category_id, min_price, max_price);
        }else{
            products = productService.findAll();
        }
        List<ProductResponse> productResponses = products.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(productResponses);
    }
    private ProductResponse convertToDto(Product product) {
        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setAvailableQuantity(product.getAvailableQuantity());
        dto.setPrice(product.getPrice());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getCategoryName());
        }
        if(product.getProductImages() !=null && !product.getProductImages().isEmpty()){
            ImageModel image=product.getProductImages().iterator().next();
            String base64Image="data:"+image.getType()+";base64,"+java.util.Base64.getEncoder().encodeToString(image.getPicBytes());
            dto.setImage(base64Image);
        }
        return dto;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Integer id) {
        Product product = productService.findById(id);
        if (product != null) {
            ProductResponse dto = convertToDto(product);
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update-product/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @RequestBody Product product) {
        Product updated = productService.updateProduct(id, product);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



}
