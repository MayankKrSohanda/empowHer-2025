package com.example.demo.controller;

import com.example.demo.model.DTO.OrderRequest;
import com.example.demo.model.DTO.OrderResponse;
import com.example.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/orders")
public class OrderController {
    @Autowired
    OrderService orderService;

@PostMapping("/placeOrder/{userId}")
public ResponseEntity<OrderResponse> placeOrder(
        @PathVariable Long userId,
        @RequestBody OrderRequest orderRequest
) {
    return ResponseEntity.ok(orderService.placeOrder(userId, orderRequest));

}

    @GetMapping("/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersForUser(userId));
    }
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    // Update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody String status
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // Update payment status
    @PutMapping("/{id}/payment")
    public ResponseEntity<OrderResponse> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody String paymentStatus
    ) {
        return ResponseEntity.ok(orderService.updatePaymentStatus(id, paymentStatus));
    }

    // Cancel order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.noContent().build();
    }

}
