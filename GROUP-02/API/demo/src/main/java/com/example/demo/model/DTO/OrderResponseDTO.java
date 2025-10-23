//package com.example.demo.model.DTO;
//
//import java.util.List;
//
//public class OrderResponseDTO {
//    private Long id;
//    private Long userId;
//    private double totalAmount;
//    private String paymentMode;
//    private String deliveryAddress;
//    private String contactNumber;
//    private List<OrderItemDTO> items;
//
//    // Getters & Setters
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//    public Long getUserId() { return userId; }
//    public void setUserId(Long userId) { this.userId = userId; }
//    public double getTotalAmount() { return totalAmount; }
//    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
//    public String getPaymentMode() { return paymentMode; }
//    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
//    public String getDeliveryAddress() { return deliveryAddress; }
//    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
//    public String getContactNumber() { return contactNumber; }
//    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
//    public List<OrderItemDTO> getItems() { return items; }
//    public void setItems(List<OrderItemDTO> items) { this.items = items; }
//}

package com.example.demo.model.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {
    private Long id;
    private Long userId;
    private String paymentMode;
    private String deliveryAddress;
    private String contactNumber;
    private double totalAmount;
    private LocalDateTime createdAt;  // <-- new field
    private List<OrderItemDTO> items;

    // getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}

