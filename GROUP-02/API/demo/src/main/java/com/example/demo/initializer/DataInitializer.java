package com.example.demo.initializer;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import com.example.demo.service.ManageOrderService;

@Component
public class DataInitializer {

    private final ManageOrderService manageOrderService;

    public DataInitializer(ManageOrderService manageOrderService) {
        this.manageOrderService = manageOrderService;
    }

    @PostConstruct
    public void init() {
        manageOrderService.initializeFromOrders();
    }
}
