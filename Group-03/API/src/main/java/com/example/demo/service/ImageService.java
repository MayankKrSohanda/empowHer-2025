package com.example.demo.service;

import com.example.demo.model.ImageModel;
import com.example.demo.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ImageService {
    @Autowired
    private ImageRepository imageRepository;

    public Optional<ImageModel> getImageById(Long id){
        return imageRepository.findById(id);
    }
}
