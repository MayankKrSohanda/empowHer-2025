package com.example.demo.controller;

import com.example.demo.model.DTO.OrderItemDTO;
import com.example.demo.model.DTO.OrderRequestDTO;
import com.example.demo.model.DTO.OrderResponseDTO;
import com.example.demo.model.OrderDetail;
import com.example.demo.model.OrderProduct;
import com.example.demo.model.User;
import com.example.demo.repository.LoginRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
//import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final LoginRepository userRepo; 

    public OrderController(OrderRepository orderRepo,
                           ProductRepository productRepo,
                           LoginRepository userRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    @PostMapping("/placeOrders")
    @Transactional
    public ResponseEntity<OrderResponseDTO> placeOrder(@RequestBody OrderRequestDTO dto) {
        if (dto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }
        if (dto.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one order item is required");
        }

        var user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        OrderDetail order = new OrderDetail();
        order.setUser(user);
        order.setOrder_date(LocalDateTime.now());
        order.setDelivery_address(dto.getDeliveryAddress());
        order.setStatus("PENDING");

        BigDecimal total = BigDecimal.ZERO;
        List<OrderProduct> orderProducts = new ArrayList<>();

        for (OrderItemDTO item : dto.getItems()) {
            var product = productRepo.findById(item.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

            BigDecimal unitPrice = product.getPrice();
            if (unitPrice == null) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Product price is missing");
            }
            int quantity = item.getQuantity();
            if (quantity <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be greater than zero");
            }

            BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));

            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setOrder(order);
            orderProduct.setProduct(product);
            orderProduct.setQuantity(quantity);
            orderProduct.setUnitPrice(unitPrice);
            orderProduct.setTotalPrice(totalPrice);

            orderProducts.add(orderProduct);
            total = total.add(totalPrice);
        }

        order.setProducts(orderProducts);
        order.setTotal_amount(total);
        order.setCreateAt(LocalDateTime.now());
        order.setUpdateAt(LocalDateTime.now());

        OrderDetail saved = orderRepo.save(order);
        OrderResponseDTO response = toOrderResponseDTO(saved);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUser(@PathVariable Integer userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }

        var orders = orderRepo.findByUser_Id(userId);

        List<OrderResponseDTO> responseList = new ArrayList<>();
        for (OrderDetail order : orders) {
            responseList.add(toOrderResponseDTO(order));
        }

        return ResponseEntity.ok(responseList);
    }

    private OrderResponseDTO toOrderResponseDTO(OrderDetail order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setOrderId(order.getOrder_id());
        dto.setUserName(order.getUser() != null ? order.getUser().getName() : null);
        dto.setDeliveryAddress(order.getDelivery_address());
        dto.setOrderDate(order.getOrder_date());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotal_amount());

        List<OrderItemDTO> responseItems = new ArrayList<>();
        if (order.getProducts() != null) {
            for (OrderProduct op : order.getProducts()) {
                OrderItemDTO itemDTO = new OrderItemDTO();
                itemDTO.setProductId(op.getProduct() != null ? op.getProduct().getId() : null);
                itemDTO.setQuantity(op.getQuantity());
                responseItems.add(itemDTO);
            }
        }
        dto.setItems(responseItems);
        return dto;
    }

}
