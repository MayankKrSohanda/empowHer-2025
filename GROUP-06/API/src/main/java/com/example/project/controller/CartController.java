package com.example.project.controller;

import com.example.project.model.CartItem;
import com.example.project.controller.ResposeObject.CartItemDTO;
import com.example.project.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestBody CartItemDTO cartItemDTO) {
        if (cartItemDTO.getUserId() == null || cartItemDTO.getProductId() == null || cartItemDTO.getQuantity() <= 0) {
            throw new IllegalArgumentException("UserId, ProductId, and quantity must be provided and quantity > 0");
        }
        return cartService.addToCart(
                cartItemDTO.getUserId(),
                cartItemDTO.getProductId(),
                cartItemDTO.getQuantity()
        );
    }

    // GET cart items for a specific user
    @GetMapping("/{userId}")
    public List<CartItem> getCartItems(@PathVariable Long userId) {
        return cartService.getCartItemsByUser(userId);
    }

    // DELETE item (decrease quantity or delete)
    @DeleteMapping("/remove/{userId}/{productId}")
    public void removeCartItem(@PathVariable Long userId, @PathVariable Long productId) {
        cartService.removeCartItem(userId, productId);
        // Returning void avoids Angular JSON parse errors
    }
}
