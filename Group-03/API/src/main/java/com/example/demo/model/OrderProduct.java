package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor       // adds default constructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "order_items")
public class OrderProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private int quantity;
    private double price;
    private double totalPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    // @JsonBackReference // back reference (child → parent) is ignored in JSON
    // @JsonIgnore simple but loose parent info in response
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

}
