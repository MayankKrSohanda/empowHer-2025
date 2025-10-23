package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map "/images/**" URLs to your actual upload directory
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///C:/Users/SATHISH AB/Documents/demo-uploads/");
    }
}
