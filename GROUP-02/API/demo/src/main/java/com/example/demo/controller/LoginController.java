package com.example.demo.controller;

import com.example.demo.model.DTO.LoginResponse;
import com.example.demo.model.User;
import com.example.demo.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private LoginService loginService;

    // ---------------- LOGIN ----------------

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        Optional<User> userOpt = loginService.login(credentials);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(
                    new LoginResponse(user.getId(), user.getEmail(), user.getRole(), user.getName()) // ✅ Include name
            );
        } else {
            return ResponseEntity.status(401)
                    .body("Invalid email or password. Please register first.");
        }
    }


    // ---------------- REGISTER ----------------
    @PostMapping("/login/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = loginService.register(user);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
