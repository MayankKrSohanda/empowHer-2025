package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    // ---------------- LOGIN ----------------
    public Optional<User> login(Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = loginRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    // ---------------- REGISTER ----------------
    public User register(User user) {
        // Check if email already exists
        if (loginRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered. Please login.");
        }

        // Set default role and isActive
        user.setRole("USER");
        user.setActive(true);

        return loginRepository.save(user);
    }
}
