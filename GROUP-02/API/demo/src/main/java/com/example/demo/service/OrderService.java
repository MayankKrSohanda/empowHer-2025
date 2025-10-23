package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.model.DTO.OrderItemDTO;
import com.example.demo.model.DTO.OrderRequestDTO;
import com.example.demo.model.DTO.OrderResponseDTO;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductSalesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductSalesRepository productSalesRepository;

    private static final int BEST_SELLER_THRESHOLD = 10; // threshold for bestseller

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        ProductSalesRepository productSalesRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.productSalesRepository = productSalesRepository;
    }

    @Transactional
    public OrderResponseDTO placeOrder(OrderRequestDTO request) {

        // Create order
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setPaymentMode(request.getPaymentMode());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setContactNumber(request.getContactNumber());

        // Process items
        List<OrderItem> items = request.getItems().stream().map(dto -> {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + dto.getProductId()));

            if (product.getQuantity() < dto.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getTitle());
            }

            // ✅ Deduct product stock
            product.setQuantity(product.getQuantity() - dto.getQuantity());
            productRepository.save(product);

            // ✅ Update or create ProductSales record
            ProductSales productSales = productSalesRepository.findByProductId(product.getId());

            if (productSales == null) {
                productSales = new ProductSales();
                productSales.setProductId(product.getId());
                productSales.setTotalQuantitySold(dto.getQuantity());
            } else {
                int newTotal = productSales.getTotalQuantitySold() + dto.getQuantity();
                productSales.setTotalQuantitySold(newTotal);
            }

            // ✅ Mark as bestseller if total ≥ threshold
            productSales.setBestSeller(productSales.getTotalQuantitySold() >= BEST_SELLER_THRESHOLD);

            // ✅ Save updated sales record
            productSalesRepository.save(productSales);

            // ✅ Log for debugging
            System.out.println("✅ Updated sales for product ID " + product.getId() +
                    " → Total Sold: " + productSales.getTotalQuantitySold() +
                    " | BestSeller: " + productSales.isBestSeller());

            // Create OrderItem
            OrderItem item = new OrderItem();
            item.setProductId(dto.getProductId());
            item.setProductName(product.getTitle());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());
            item.setSubtotal(dto.getPrice() * dto.getQuantity());
            item.setOrder(order);
            return item;
        }).collect(Collectors.toList());

        // Attach items to order
        order.setItems(items);

        // Calculate total
        double total = items.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setTotalAmount(total);

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Map to DTO
        List<OrderItemDTO> itemDTOs = savedOrder.getItems().stream().map(item -> {
            OrderItemDTO dto = new OrderItemDTO();
            dto.setProductId(item.getProductId());
            dto.setProductName(item.getProductName());
            dto.setPrice(item.getPrice());
            dto.setQuantity(item.getQuantity());
            return dto;
        }).collect(Collectors.toList());

        // Build response
        OrderResponseDTO response = new OrderResponseDTO();
        response.setId(savedOrder.getId());
        response.setUserId(savedOrder.getUserId());
        response.setPaymentMode(savedOrder.getPaymentMode());
        response.setDeliveryAddress(savedOrder.getDeliveryAddress());
        response.setContactNumber(savedOrder.getContactNumber());
        response.setTotalAmount(savedOrder.getTotalAmount());
        response.setCreatedAt(savedOrder.getCreatedAt());
        response.setItems(itemDTOs);

        return response;
    }

    public List<OrderResponseDTO> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToResponseDTO(order);
    }

    private OrderResponseDTO mapToResponseDTO(Order order) {
        List<OrderItemDTO> items = order.getItems().stream().map(item -> {
            OrderItemDTO dto = new OrderItemDTO();
            dto.setProductId(item.getProductId());
            dto.setProductName(item.getProductName());
            dto.setPrice(item.getPrice());
            dto.setQuantity(item.getQuantity());
            return dto;
        }).collect(Collectors.toList());

        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setPaymentMode(order.getPaymentMode());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setContactNumber(order.getContactNumber());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(items);
        return dto;
    }

    public void attachBestSellerToProducts(List<Product> products) {
        products.forEach(p -> {
            ProductSales ps = productSalesRepository.findByProductId(p.getId());
            p.setBestSeller(ps != null && ps.isBestSeller());
        });
    }



}
