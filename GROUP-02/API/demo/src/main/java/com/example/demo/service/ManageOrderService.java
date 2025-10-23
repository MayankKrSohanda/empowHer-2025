package com.example.demo.service;

import com.example.demo.model.ManageOrder;
import com.example.demo.model.Order;
import com.example.demo.repository.ManageOrderRepository;
import com.example.demo.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class ManageOrderService {

    private final ManageOrderRepository manageRepo;
    private final OrderRepository orderRepo;

    public ManageOrderService(ManageOrderRepository manageRepo, OrderRepository orderRepo) {
        this.manageRepo = manageRepo;
        this.orderRepo = orderRepo;
    }

    // Fetch all orders
    public List<ManageOrder> getAllOrders() {
        return manageRepo.findAll();
    }

    // Mark order as shipped
    @Transactional
    public ManageOrder shipOrder(Long orderId) {
        ManageOrder order = manageRepo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        if (!"Placed".equals(order.getStatus())) {
            throw new RuntimeException("Only orders with status 'Placed' can be shipped");
        }

        order.setStatus("Shipped");
        return order; // transactional context will save automatically
    }

    // Mark order as delivered and set delivery date
    @Transactional
    public ManageOrder deliverOrder(Long orderId) {
        ManageOrder order = manageRepo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        if (!"Shipped".equals(order.getStatus())) {
            throw new RuntimeException("Only orders with status 'Shipped' can be delivered");
        }

        order.setStatus("Delivered");
        order.setDeliveryDate(LocalDateTime.now());
        return order;
    }

    // Initialize manage_orders from orders table (avoid duplicates)
    @Transactional
    public void initializeFromOrders() {
        List<Order> orders = orderRepo.findAll();
        for (Order o : orders) {
            manageRepo.findByOrderId(o.getId()).ifPresentOrElse(
                    existing -> {}, // do nothing if already exists
                    () -> {
                        ManageOrder mo = new ManageOrder();
                        mo.setOrderId(o.getId());
                        mo.setTotalPrice(o.getTotalAmount());
                        mo.setStatus("Placed");
                        manageRepo.save(mo);
                    }
            );
        }
    }

    // Calculate weekly earnings for last 4 weeks
    public Map<Integer, Double> getWeeklyEarnings() {
        List<ManageOrder> orders = getAllOrders();
        Map<Integer, Double> weeklyEarnings = new TreeMap<>();

        int currentWeek = LocalDateTime.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);

        // Initialize last 4 weeks
        for (int i = currentWeek - 3; i <= currentWeek; i++) {
            weeklyEarnings.put(i, 0.0);
        }

        // Sum earnings for delivered orders
        orders.stream()
                .filter(o -> "Delivered".equals(o.getStatus()) && o.getDeliveryDate() != null)
                .forEach(o -> {
                    int week = o.getDeliveryDate().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
                    if (weeklyEarnings.containsKey(week)) {
                        weeklyEarnings.put(week, weeklyEarnings.get(week) + o.getTotalPrice());
                    }
                });

        return weeklyEarnings;
    }
}
