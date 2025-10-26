package com.example.demo.service;

import com.example.demo.model.CartItem;
import com.example.demo.model.DTO.CartResponseDTO;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.LoginRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private ProductRepository productRepository;

    public void addToCart(Integer userId, Integer productId, int quantity) {

        Optional<User> userOptional = loginRepository.findById(userId);
        Optional<Product> productOptional = productRepository.findById(productId);

        if (userOptional.isPresent() && productOptional.isPresent()) {
            User user = userOptional.get();
            Product product = productOptional.get();

            Optional<CartItem> existingItem = cartRepository.findByUserAndProduct(user, product);

            if (existingItem.isPresent()) {
                CartItem cartItem = existingItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
                cartItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
                cartItem.setUpdateAt(LocalDateTime.now());
                cartRepository.save(cartItem);
            } else {
                CartItem newCartItem = new CartItem();
                newCartItem.setUser(user);
                newCartItem.setProduct(product);
                newCartItem.setQuantity(quantity);
                newCartItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
                newCartItem.setCreateAt(LocalDateTime.now());
                newCartItem.setUpdateAt(LocalDateTime.now());
                cartRepository.save(newCartItem);
            }
        } else {
            throw new RuntimeException("User or Product not found.");
        }
    }

    public List<CartResponseDTO> getCartItems(Integer userId) {
        return loginRepository.findById(userId)
                .map(user -> cartRepository.findByUser(user).stream().map(item -> {
                    CartResponseDTO dto = new CartResponseDTO();
                    dto.setProductId(item.getProduct().getId());
                    dto.setProductName(item.getProduct().getTitle());
                    dto.setQuantity(item.getQuantity());
                    dto.setPrice(item.getProduct().getPrice());
                    dto.setTotalPrice(item.getTotalPrice());
                    return dto;
                }).toList())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void removeFromCart(Integer cartItemId) {
        cartRepository.deleteById(cartItemId);
    }
}