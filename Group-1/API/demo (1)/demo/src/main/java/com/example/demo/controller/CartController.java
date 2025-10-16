package com.example.demo.controller;

import com.example.demo.model.CartItem;
import com.example.demo.model.DTO.AddToCartRequest;
import com.example.demo.model.DTO.CartItemResponse;
import com.example.demo.model.User;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.LoginRepository;
import com.example.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    public CartController(CartService cartService){
        this.cartService=cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestBody AddToCartRequest request) {
        cartService.addToCart(request.getUserId(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok("Product added to cart");
    }


    @GetMapping("/user/{userId}")
    public List<CartItemResponse> getCartItems(@PathVariable Integer userId) {
        User user = loginRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser(user)
                .stream()
                .map(item -> new CartItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getTitle(),
                        item.getProduct().getPrice(),
                        item.getQuantity(),
                        item.getTotalPrice()
                ))
                .toList();
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Integer cartItemId) {
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.ok("Item removed successfully");
    }


}
