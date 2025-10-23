package com.example.demo.service;

import com.example.demo.model.Cart;
import com.example.demo.model.DTO.CartDTO;
import com.example.demo.model.DTO.CartResponseDTO;
import com.example.demo.model.Product;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    // ➕ Add product to cart (increase quantity if already exists)
    public Cart addToCart(CartDTO cartDTO) {
        // Check if product exists
        Optional<Product> productOpt = productRepository.findById(cartDTO.getProductId());
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + cartDTO.getProductId());
        }
        Product product = productOpt.get();

        // Check if this product already exists in user's cart
        Optional<Cart> existingCartOpt = cartRepository.findByUserIdAndProductId(
                cartDTO.getUserId(), cartDTO.getProductId()
        );

        if (existingCartOpt.isPresent()) {
            // Update quantity
            Cart existingCart = existingCartOpt.get();
            int newQuantity = existingCart.getQuantity() + (cartDTO.getQuantity() > 0 ? cartDTO.getQuantity() : 1);
            existingCart.setQuantity(newQuantity);
            return cartRepository.save(existingCart);
        } else {
            // Create new cart entry
            Cart cart = new Cart();
            cart.setUserId(cartDTO.getUserId());
            cart.setProductId(product.getId());
            cart.setProductName(product.getTitle());
            cart.setPrice(product.getPrice().doubleValue());
            cart.setQuantity(cartDTO.getQuantity() > 0 ? cartDTO.getQuantity() : 1);
            return cartRepository.save(cart);
        }
    }

    // Get all cart items by userId
    public List<CartResponseDTO> getCartByUserId(Long userId) {
        List<Cart> carts = cartRepository.findByUserId(userId);

        return carts.stream().map(cart -> {
            Optional<Product> productOpt = productRepository.findById(cart.getProductId());
            String imageUrl = productOpt.map(Product::getImageUrl).orElse(""); // get image from product
            return new CartResponseDTO(
                    cart.getId(),
                    cart.getUserId(),
                    cart.getProductId(),
                    cart.getProductName(),
                    cart.getPrice(),
                    cart.getQuantity(),
                    imageUrl
            );
        }).toList();
    }


    // Remove single item from cart
    public void removeFromCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }

    // Clear all items for a user
    public void clearCart(Long userId) {
        List<Cart> carts = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(carts);
    }


    public Cart updateQuantity(Long cartId, int quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id " + cartId));
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

}
