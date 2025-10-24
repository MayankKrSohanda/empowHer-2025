package com.example.demo.service;

import com.example.demo.model.DTO.CartItemDTO;
import com.example.demo.model.CartItem;
import com.example.demo.model.Product;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;


    @Autowired
    private ProductRepository productRepository;

    // Convert entity to DTO
    private CartItemDTO toDTO(CartItem item) {
        Product product = productRepository.findById(item.getProductId()).orElse(null);

        String title = (product != null) ? product.getTitle() : "Unknown Product";
        double price = (product != null) ? product.getPrice() : 0.0;
        int availQuantity = (product != null) ? product.getQuantity() : 0;


        return new CartItemDTO(
                item.getId(),
                item.getUserId(),
                item.getProductId(),
                item.getQuantity(),
                title,
                price,
                availQuantity
        );
    }

    // ✅ Add item to cart with "update quantity if product already exists"
    public CartItemDTO addToCart(Long userId, Long productId, int quantity) {
        List<CartItem> existingItems = cartRepository.findByUserId(userId);
        for (CartItem item : existingItems) {
            if (item.getProductId().equals(productId)) {
                item.setQuantity(item.getQuantity() + quantity); // update quantity
                return toDTO(cartRepository.save(item));
            }
        }
        // If product not already in cart → create new
        CartItem newItem = CartItem.builder()
                .userId(userId)
                .productId(productId)
                .quantity(quantity)
                .build();

        return toDTO(cartRepository.save(newItem));
    }

    // Get all cart items for a user
    public List<CartItemDTO> getCartItems(Long userId) {
        return cartRepository.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    @Transactional
    public CartItemDTO updateCartItemQuantity(Long cartItemId, int quantity, Long userId) {
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized action");
        }

        // Check available stock from Product
        Product product = productRepository.findById(cartItem.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (quantity > product.getQuantity()) {
            throw new RuntimeException("Cannot exceed available stock");
        }

        if (quantity <= 0) {
            // Remove the item if quantity is zero or negative
            cartRepository.deleteById(cartItemId);
            return null; // Indicate removal
        }

        cartItem.setQuantity(quantity);
        return toDTO(cartRepository.save(cartItem));
    }





    // Remove single cart item by cartItemId
    public void removeCartItem(Long cartItemId) {
        cartRepository.deleteById(cartItemId);
    }

    // Clear entire cart
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }

}
