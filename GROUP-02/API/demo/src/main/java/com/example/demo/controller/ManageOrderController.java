package com.example.demo.controller;

import com.example.demo.model.ManageOrder;
import com.example.demo.service.ManageOrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/manage-orders")
public class ManageOrderController {

    private final ManageOrderService service;

    public ManageOrderController(ManageOrderService service) {
        this.service = service;
    }

    // Fetch all orders
    @GetMapping
    public List<ManageOrder> getAllOrders() {
        return service.getAllOrders();
    }

    // Mark order as shipped
    @PutMapping("/{orderId}/ship")
    public ManageOrder shipOrder(@PathVariable Long orderId) {
        return service.shipOrder(orderId);
    }

    // Mark order as delivered
    @PutMapping("/{orderId}/deliver")
    public ManageOrder deliverOrder(@PathVariable Long orderId) {
        return service.deliverOrder(orderId);
    }

    // Get weekly earnings (last 4 weeks)
    @GetMapping("/weekly-earnings")
    public Map<Integer, Double> getWeeklyEarnings() {
        return service.getWeeklyEarnings();
    }
}
