package com.example.demo.controller;

import com.example.demo.model.DTO.ProductDTO;
import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;


@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<ProductDTO> getProducts(HttpServletRequest request,
            @RequestParam(required = false) String title,
                                        @RequestParam(required = false) Long categoryId,
                                        @RequestParam(required = false) Double minPrice,
                                        @RequestParam(required = false) Double maxPrice) {

        String baseUrl=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort();
        if (title != null && !title.isEmpty()) {
            return productService.searchProductsByTitle(title,baseUrl);
        }
        if (categoryId!=null  || minPrice != null || maxPrice != null){
            return productService.filterProducts(categoryId, minPrice, maxPrice,baseUrl);
        }

        return productService.listProducts(baseUrl);

    }


    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ProductDTO> addProduct(HttpServletRequest request,@RequestPart("product") Product product,@RequestPart(value = "imgFile",required =false) MultipartFile[] files){

            Product saved=productService.addProduct(product,files);
            String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
                    .replacePath(null)
                    .build()
                    .toUriString();
            ProductDTO dto = new ProductDTO(saved, baseUrl);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);

    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            headers = "Content-Type=multipart/form-data")
    public ResponseEntity<ProductDTO> updateProduct(HttpServletRequest request,@PathVariable Long id,@RequestPart("product") Product product,@RequestPart(value = "imgFile",required = false) MultipartFile[] files){
        try{
            Product updated = productService.updateProduct(id, product, files);
            String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
                    .replacePath(null).build().toUriString();
            ProductDTO dto = new ProductDTO(updated, baseUrl);
            return ResponseEntity.ok(dto);

        }catch (RuntimeException e){
            System.out.println("Error: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(HttpServletRequest request, @PathVariable Long id) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        return productService.getProductById(id)
                .map(product -> ResponseEntity.ok(new ProductDTO(product, baseUrl)))
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id){
        boolean deleted=productService.deleteProduct(id);
        return deleted?ResponseEntity.noContent().build():ResponseEntity.notFound().build();
    }
}




