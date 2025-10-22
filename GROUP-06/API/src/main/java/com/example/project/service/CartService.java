package com.example.project.service;

import com.example.project.Repository.CartItemRepository;
import com.example.project.Repository.ProductRepository;
import com.example.project.Repository.loginRepository;
import com.example.project.model.CartItem;
import com.example.project.model.Product;
import com.example.project.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final loginRepository loginRepository;

    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository, loginRepository loginRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.loginRepository = loginRepository;
    }

    public CartItem addToCart(Long userId, Long productId, int quantity) {
        User user = loginRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem existingItem = cartItemRepository.findByUserAndProduct(user, product);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            return cartItemRepository.save(cartItem);
        }
    }

    public List<CartItem> getCartItemsByUser(Long userId) {
        User user = loginRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartItemRepository.findByUser(user);
    }

    // Remove cart item for a user (decrease quantity or delete)
    public void removeCartItem(Long userId, Long productId) {
        User user = loginRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByUserAndProduct(user, product);

        if (item != null) {
            if (item.getQuantity() > 1) {
                item.setQuantity(item.getQuantity() - 1);
                cartItemRepository.save(item);
            } else {
                cartItemRepository.delete(item);
            }
        }
    }
}
