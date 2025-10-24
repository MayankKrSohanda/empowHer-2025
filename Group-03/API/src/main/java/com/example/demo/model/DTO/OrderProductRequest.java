package com.example.demo.model.DTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderProductRequest {
    private Long id;
    private Long productId;
    private Integer quantity;
    private Double price;


}
