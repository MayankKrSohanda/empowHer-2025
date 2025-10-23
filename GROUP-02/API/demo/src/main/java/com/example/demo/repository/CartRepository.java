//package com.example.demo.repository;
//
//import com.example.demo.model.Cart;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface CartRepository extends JpaRepository<Cart, Long> {
//
//    // 🔹 Get all items for a user
//    List<Cart> findByUserId(Long userId);
//
//    // 🔹 Check if a user already has a specific product in cart
//    Optional<Cart> findByUserIdAndProductId(Long userId, Long productId);
//    void deleteById(Long cartId);
//}


package com.example.demo.repository;

import com.example.demo.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByUserId(Long userId);

    Optional<Cart> findByUserIdAndProductId(Long userId, Long productId);

    void deleteById(Long cartId);
}
