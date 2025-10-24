package com.example.demo.service;

import com.example.demo.model.DTO.OrderProductResponse;
import com.example.demo.model.DTO.OrderRequest;
import com.example.demo.model.CartItem;
import com.example.demo.model.DTO.OrderResponse;
import com.example.demo.model.Order;
import com.example.demo.model.OrderProduct;
import com.example.demo.model.Product;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderProductResponse> itemResponse = order.getItems().stream()
                .map(item -> new OrderProductResponse(
                        item.getProductId(),
                        item.getQuantity(),
                        item.getPrice()
                )).collect(Collectors.toList());
        String orderDateStr = (order.getOrderDate() != null) ? order.getOrderDate().toString() : null;

        return OrderResponse.builder()
                .id(order.getId())
                .orderId(order.getOrderId())
                .userId(order.getUserId())
                .orderStatus(order.getOrderStatus())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .orderDate(orderDateStr)
                .totalPrice(order.getTotalPrice())
                .deliveryAddress(order.getDeliveryAddress())
                .phoNo(order.getPhoneNumber())
                .items(itemResponse)
                .build();
    }

    @Transactional
    public OrderResponse placeOrder(Long userId, OrderRequest orderRequest) {
        Order order = new Order();
        String orderId = "ORD"+UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        order.setOrderId(orderId);
        order.setUserId(userId);
        order.setOrderStatus(orderRequest.getOrderStatus());
        order.setPaymentStatus(orderRequest.getPaymentStatus());
        order.setDeliveryAddress(orderRequest.getDeliveryAddress());
        order.setPhoneNumber(orderRequest.getPhoneNumber());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setOrderNotes(orderRequest.getOrderNotes());

        double totalPrice = 0.0;
        List<OrderProduct> orderItems = new ArrayList<>();

        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("No items to checkout!");
        }

        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getTitle());
            }
            double itemTotal = product.getPrice() * cartItem.getQuantity();
            totalPrice += itemTotal;

            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderProduct orderItem = OrderProduct.builder()
                    .productId(product.getProductId())
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .totalPrice(itemTotal)
                    .order(order)
                    .build();
            orderItems.add(orderItem);
        }

        order.setTotalPrice(totalPrice);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        cartRepository.deleteByUserId(userId);

        List<OrderProductResponse> itemResponse = savedOrder.getItems().stream()
                .map(item -> new OrderProductResponse(
                        item.getProductId(),
                        item.getQuantity(),
                        item.getPrice()
                )).collect(Collectors.toList());

        return mapToOrderResponse(savedOrder);


    }


    public List<OrderResponse> getOrdersForUser(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }



    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }


    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(status);
        orderRepository.save(order);
        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse updatePaymentStatus(Long id, String paymentStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setPaymentStatus(paymentStatus);
        orderRepository.save(order);
        return mapToOrderResponse(order);
    }

    @Transactional
    public void cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus("CANCELLED");
        orderRepository.save(order);
    }

}
