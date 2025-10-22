package com.example.project.Repository;

import com.example.project.controller.ResposeObject.OrderDTO;
import com.example.project.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
//    List<OrderDTO> findbyUserId(Long userId);
}