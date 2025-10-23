package com.example.demo.repository;

import com.example.demo.model.ManageOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ManageOrderRepository extends JpaRepository<ManageOrder, Long> {
    Optional<ManageOrder> findByOrderId(Long orderId);
}
