// com.example.demo.service.FileStorageService
package com.example.demo;

import com.example.demo.model.ImageModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload folder", e);
        }
    }

    public ImageModel storeFile(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String ext = "";
        int dot = originalFilename.lastIndexOf('.');
        if (dot > 0) ext = originalFilename.substring(dot);

        // Create date-based subfolder for organization (optional)
        String dateFolder = LocalDate.now().toString(); // e.g., 2025-10-11
        Path targetDir = rootLocation.resolve(dateFolder);
        try {
            Files.createDirectories(targetDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create directory for date folder", e);
        }

        // Unique filename to avoid collisions
        String storedFileName = UUID.randomUUID().toString() + ext;
        Path target = targetDir.resolve(storedFileName);

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + originalFilename, e);
        }

        // imgPath is the relative path to serve — used to build URL later
        String imgPath = "uploads/" + dateFolder + "/" + storedFileName;

        return ImageModel.builder()
                .imgName(originalFilename)
                .fileName(storedFileName)
                .imgType(file.getContentType())
                .imgPath(imgPath)
                .build();

    }

    public Path loadPath(String imgPath) {
        return rootLocation.resolve(imgPath.replace("uploads/", "")).normalize();
    }

    public boolean deleteFile(String imgPath) {
        try {
            // if imgPath stored as "2025-10-12/uuid.png" or "uploads/2025-10-12/uuid.png"
            // resolve correctly against rootLocation:
            String relative = imgPath;
            if (imgPath.startsWith("/")) relative = imgPath.substring(1);
            // if you stored with leading uploads/ remove or keep accordingly
            // best practice: store relative path (dateFolder + "/" + storedFileName)
            Path absolute = rootLocation.resolve(relative).normalize();
            return Files.deleteIfExists(absolute);
        } catch (IOException e) {
            return false;
        }
    }


    public Path getRootLocation() {
        return rootLocation;
    }
}
