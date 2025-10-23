package com.example.demo.controller;

import com.example.demo.model.DTO.OrderResponseDTO;
import com.example.demo.model.Order;
import com.example.demo.model.DTO.OrderRequestDTO;
import com.example.demo.service.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Place a new order
    @PostMapping("/place")
    public OrderResponseDTO placeOrder(@RequestBody OrderRequestDTO request) {
        return orderService.placeOrder(request);
    }

    // Get all orders by a user
    @GetMapping("/user/{userId}")
    public List<OrderResponseDTO> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    // Get a specific order by ID
    @GetMapping("/{orderId}")
    public OrderResponseDTO getOrderById(@PathVariable Long orderId) {
        return orderService.getOrder(orderId);
    }
}
