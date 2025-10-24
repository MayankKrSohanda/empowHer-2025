package com.example.demo.controller;

import com.example.demo.model.DTO.CartItemDTO;
import com.example.demo.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Get all cart items for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItemDTO>> getCartItems(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    // ✅ Add item to cart (works with updated logic in service)
    @PostMapping("/add")
    public ResponseEntity<CartItemDTO> addToCart(@RequestBody CartItemDTO cartItemDTO) {
        return ResponseEntity.ok(
                cartService.addToCart(
                        cartItemDTO.getUserId(),
                        cartItemDTO.getProductId(),
                        cartItemDTO.getQuantity()
                )
        );
    }

    // Remove single item by cartItemId
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ResponseEntity.noContent().build();
    }

    // Clear entire cart
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateCartItemQuantity(
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Object> payload) {

        int quantity = (Integer) payload.get("quantity");
        Long userId = Long.valueOf(payload.get("userId").toString());

        CartItemDTO updatedItem = cartService.updateCartItemQuantity(cartItemId, quantity, userId);

        if (updatedItem == null) {
            return ResponseEntity.noContent().build();  // Item was removed
        }

        return ResponseEntity.ok(updatedItem);
    }

}
