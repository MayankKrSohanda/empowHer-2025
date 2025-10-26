package com.example.demo.repository;

import com.example.demo.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderDetail, Integer> {

    List<OrderDetail> findByUser_IdAndStatus(Integer userId, String status);
    List<OrderDetail> findByUser_Id(Integer userId);
}
