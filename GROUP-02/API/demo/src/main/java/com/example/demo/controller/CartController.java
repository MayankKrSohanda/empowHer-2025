//package com.example.demo.controller;
//
//import com.example.demo.model.Cart;
//import com.example.demo.model.DTO.CartDTO;
//import com.example.demo.service.CartService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/cart")
//@CrossOrigin(origins = "http://localhost:4200")
//public class CartController {
//
//    private final CartService cartService;
//
//    public CartController(CartService cartService) {
//        this.cartService = cartService;
//    }
//
//    @PostMapping("/add")
//    public ResponseEntity<Cart> addToCart(@RequestBody CartDTO cartDTO) {
//        Cart cart = cartService.addToCart(cartDTO);
//        return ResponseEntity.ok(cart);
//    }
//
//    @GetMapping("/{userId}")
//    public ResponseEntity<List<Cart>> getCartByUser(@PathVariable Long userId) {
//        return ResponseEntity.ok(cartService.getCartByUserId(userId));
//    }
//
//    @DeleteMapping("/remove/{cartId}")
//    public ResponseEntity<String> removeFromCart(@PathVariable Long cartId) {
//        cartService.removeFromCart(cartId);
//        return ResponseEntity.ok("Item removed from cart");
//    }
//
//    @DeleteMapping("/clear/{userId}")
//    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
//        cartService.clearCart(userId);
//        return ResponseEntity.ok("Cart cleared for user " + userId);
//    }
//}


package com.example.demo.controller;

import com.example.demo.model.Cart;
import com.example.demo.model.DTO.CartDTO;
import com.example.demo.model.DTO.CartResponseDTO;
import com.example.demo.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody CartDTO cartDTO) {
        Cart cart = cartService.addToCart(cartDTO);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartResponseDTO>> getCartByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }


    @DeleteMapping("/remove/{cartId}")
    public ResponseEntity<Map<String, String>> removeFromCart(@PathVariable Long cartId) {
        cartService.removeFromCart(cartId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Item removed from cart");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Map<String, String>> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cart cleared for user " + userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{cartId}")
    public ResponseEntity<Cart> updateCartQuantity(
            @PathVariable Long cartId,
            @RequestParam int quantity) {
        Cart updatedCart = cartService.updateQuantity(cartId, quantity);
        return ResponseEntity.ok(updatedCart);
    }



}