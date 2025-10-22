package com.example.project.controller;
import com.example.project.model.Order;
import com.example.project.controller.ResposeObject.OrderDTO;
import com.example.project.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Use DTO for the response
    @PostMapping
    public ResponseEntity<OrderDTO> placeOrder(@RequestBody Order order,
                                               @RequestParam Long userId) {
        Order savedOrder = orderService.placeOrder(order, userId);
        OrderDTO orderDTO = new OrderDTO(savedOrder);
        return ResponseEntity.ok(orderDTO);
    }


    // Get all orders
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<List<OrderDTO>> getOrdersByUserId( @RequestParam Long userId ) {
//        List<OrderDTO> orders = orderService.getOrdersByUserId(userId);
//        return ResponseEntity.ok(orders);
//    }
}
