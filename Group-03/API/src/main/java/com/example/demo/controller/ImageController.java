//package com.example.demo.controller;
//
//import com.example.demo.model.ImageModel;
//import com.example.demo.repository.ImageRepository;
//import com.example.demo.service.ImageService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Optional;
//
//@RestController
//@RequestMapping("api/products/images")
//public class ImageController {
//    @Autowired
//    private ImageService imgService;
//
//    @GetMapping("/{id}")
//    public ResponseEntity<byte[]> getImage(@PathVariable Long id){
//        Optional<ImageModel> imgOpt=imgService.getImageById(id);
//        if(imgOpt.isPresent()){
//            ImageModel img=imgOpt.get();
//            return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE,img.getImgType()).body(img.getImgByte());
//        }
//        else{
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//}
// com.example.demo.controller.ImageController
package com.example.demo.controller;

import com.example.demo.model.ImageModel;
import com.example.demo.repository.ImageRepository;
import com.example.demo.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
@RequestMapping("/api/products/images")
public class ImageController {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getImage(@PathVariable Long id) {
        Optional<ImageModel> imgOpt = imageRepository.findById(id);
        if (imgOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ImageModel imgModel = imgOpt.get();
        try {
            // Build path to file: uploads/<date>/<fileName>
            Path root = fileStorageService.getRootLocation();
            String[] parts = imgModel.getImgPath().split("/");
            // imgPath might be like /uploads/2025-10-11/uuid.png -> handle robustly
            Path file = Paths.get(imgModel.getImgPath().startsWith("/") ? imgModel.getImgPath().substring(1) : imgModel.getImgPath());
            Path absolute = root.resolve(imgModel.getImgPath().replace("uploads/", "")).normalize();

            Resource resource = new UrlResource(absolute.toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = imgModel.getImgType();
            if (contentType == null) {
                try {
                    contentType = Files.probeContentType(absolute);
                } catch (IOException ignored) {}
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType == null ? "application/octet-stream" : contentType))
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
