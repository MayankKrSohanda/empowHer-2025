package com.example.project.service;

import com.example.project.Repository.OrderRepository;
import com.example.project.Repository.loginRepository;
import com.example.project.controller.ResposeObject.OrderDTO;
import com.example.project.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service

public class OrderService {

@Autowired
    private OrderRepository orderRepository;
    private loginRepository loginRepository;

    public OrderService(loginRepository loginRepository) {
        this.loginRepository = loginRepository;
    }

    // Place order and return saved entity
    public Order placeOrder(Order order, Long userId) {
        User user = loginRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        order.setUser(user);

        double total = 0;
        for (OrderProduct op : order.getOrderProducts()) {
            op.setOrder(order); // important
            op.setTotalPrice(op.getQuantity() * op.getPrice());
            total += op.getTotalPrice();
        }

        order.setTotalAmount(total);
        order.setStatus("PLACED");
        order.setOrderDate(LocalDate.now());

        return orderRepository.save(order);
    }

    // Get all orders as DTOs without streams
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderDTO> orderDTOs = new ArrayList<>();

        for (Order order : orders) {
            OrderDTO dto = new OrderDTO(order); // map each Order to OrderDTO
            orderDTOs.add(dto);
        }

        return orderDTOs; // return the mapped list
    }

//    public List<OrderDTO> getOrdersByUserId(Long userId) {
//        return orderRepository.findbyUserId(userId);
//    }
}
